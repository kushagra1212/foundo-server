import User from '../models/User';
import UserSetting from '../models/UserSetting';
import promisePool from '../db';
const salt = process.env.SALT as string;
import bcrypt from 'bcrypt';
import {
  createToken,
  isValidCountryCode,
  isValidPhoneNumber,
  isValidPhoneNumberWithCountryCodeWithSign,
  sendTransactionalEmail,
} from '../utils/index';
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
import S3Image from '../s3/S3image';
import logger from '../logger/logger';
import { NextFunction, Request, Response } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { RequestWithJwt } from '../types/types';
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
  UpdateError,
  ValidationError,
} from '../custom-errors/customErrors';
import { sendFcmMessage } from '../firebase/firebase';
import { sendPushNotification } from '../firebase/expo-push-notify';
//create user | POST
const signupUser = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;
  let connection;
  try {
    if (!firstName || !lastName || !email || !password) {
      throw new ValidationError(
        'firstName, lastName, email and password are required',
      );
    }
    let hashedPassword = await bcrypt.hash(password, parseInt(salt));
    connection = await promisePool.getConnection();
    connection.beginTransaction();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const [result, _] = await user.save();
    const userSetting = new UserSetting({
      fk_userId: result.insertId,
    });
    await userSetting.save();
    connection.commit();

    logger.info(`User ${result.insertId} created`);

    res.status(201).send({
      user: { ...user, userId: (result as OkPacket).insertId, password: '' },
      message: 'Account Created !',
      success: true,
    });
  } catch (err: any) {
    if (connection) connection.rollback();
    if (err.errno === 1062) {
      err.message = 'This Email is already in use !';
    }
    logger.error(err.message);
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

//SignIn user
const signinUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, pushNotificationToken } = req.body;
  try {
    if (!email || !password) {
      logger.error(`email and password are required`);
      throw new ValidationError('email and password are required');
    }
    const [user, _] = await User.findUserByEmail({ userEmail: email });

    if (!user || !user.length) {
      logger.error(`User with email ${email} not found`);
      throw new BadRequestError('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      logger.error(`User ${user[0].id} entered wrong password`);
      throw new BadRequestError('password is incorrect');
    }
    const token = createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken,
    });
    logger.info(`User ${user[0].id} logged in`);
    logger.info('Sending FCM Notification + Push Notification: pushNotificationToken: ', pushNotificationToken);
    if (pushNotificationToken !== undefined) {
      await User.updateUser({
        user: {
          ...user[0],
          pushNotificationToken,
        },
        id: user[0].id,
      });
    }

    res.status(200).send({
      jwtToken: token,
      message: 'successfully loggedin',
      user: { ...user[0], password: '' },
      success: true,
    });
  } catch (err: any) {
    logger.error(err.message);
    next(err);
  }
};

//delete User based on userId | POST

const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.error(`id is required`);

      throw new BadRequestError('userId is required');
    }
    const [userResult, __] = await User.findUser({ id: Number(id) });

    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      throw new NotFoundError('user not found');
    }

    const [result, _] = await User.deleteUser({ userId: Number(id) });

    if (result.affectedRows) {
      logger.info(`user ${id} deleted`);
      return res.status(200).send({ user: userResult[0], success: true });
    }
    logger.error(`user ${id} is not deleted`);
    throw new UnprocessableEntityError('user is not deleted');
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

// get user by user id | GET
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const reqJwt = req as RequestWithJwt;

  const userIdWhoMadeReq = reqJwt.jwt.id;

  try {
    if (!id) {
      logger.error(`userId is required`);
      throw new ValidationError('userId is required');
    }
    const [userResult, __] = await User.findUser({ id: Number(id) });
    const [userSettingResult, ___] = await UserSetting.findUserSetting({
      fk_userId: Number(id),
    });
    const userSetting = userSettingResult[0];

    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      throw new NotFoundError('user not found');
    }
    let user = userResult[0];
    if (userSetting && user.id !== userIdWhoMadeReq) {
      if (!userSetting.displayPhoneNo) user = { ...user, phoneNo: null };
      if (!userSetting.displayAddress) user = { ...user, address: null };
      if (!userSetting.displayProfilePhoto)
        user = { ...user, profilePhoto: null };
    }

    logger.info(`user ${id} found`);
    res.status(200).send({ user, success: true });
  } catch (err: any) {
    next(err);
  }
};

// Update User by Id
const updateUserById = async (
  req: RequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  const idFromJwt = req.jwt.id;
  const { id: userId } = req.params;
  const newProfilePhoto = req.body.profilePhoto;
  const newAddress = req.body.address;
  const newPhoneNo = req.body.phoneNo;
  const newCountryCode = req.body.countryCode;

  try {
    if (!userId) {
      logger.error(`userId is required`);
      throw new ValidationError('userId is required');
    }
    if (idFromJwt !== Number(userId)) {
      logger.error(
        `user ${idFromJwt} is not authorized to update user ${userId}`,
      );
      throw new BadRequestError(`you are not authorized to update user`);
    }
    const [userResult, __] = await User.findUser({ id: Number(userId) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${userId}`);
      throw new NotFoundError('user not found');
    }

    let user = userResult[0];

    /* Phone Number Update */

    const isNewPhoneNoValid =
      isValidPhoneNumberWithCountryCodeWithSign(newPhoneNo);

    const isPhoneNoExistAndIsNotValid = newPhoneNo && !isNewPhoneNoValid;
    if (isPhoneNoExistAndIsNotValid) {
      logger.error(`invalid phone number`);
      throw new ValidationError('invalid phone number');
    }
    const isPhoneNoExistAndIsValid = newPhoneNo && isNewPhoneNoValid;
    if (isPhoneNoExistAndIsValid && user.phoneNo === newPhoneNo) {
      logger.error(`phone number already exists`);
      throw new ValidationError('phone number already exists');
    }

    if (isPhoneNoExistAndIsValid && user.phoneNo !== newPhoneNo) {
      user.phoneNo = newPhoneNo;
    }

    /* Country Code Update */

    const isCountryCodeValid = isValidCountryCode(newCountryCode);
    const isCountryCodeExistAndIsNotValid =
      newCountryCode && !isCountryCodeValid;
    if (isCountryCodeExistAndIsNotValid) {
      logger.error(`invalid country code`);
      throw new ValidationError('invalid country code');
    }

    const isCountryCodeExistAndIsValid = newCountryCode && isCountryCodeValid;

    if (isCountryCodeExistAndIsValid) {
      user.countryCode = newCountryCode;
    }

    /* Profile Photo Update */

    if (newProfilePhoto) {
      try {
        const s3ImageObj = new S3Image();
        await s3ImageObj.delete(user.profilePhoto);
        const location = await s3ImageObj.upload({
          id: userId,
          base64: newProfilePhoto,
          folderName: 'profilePhoto',
        });
        user.profilePhoto = location;
      } catch (err) {
        logger.error(err.message);
      }
    }

    /* Address Update */

    const isAddressExistAndIsValid = newAddress && newAddress.length > 0;

    if (isAddressExistAndIsValid) {
      user.address = newAddress;
    }

    try {
      user = {
        ...user,
        phoneNo: user.phoneNo,
        countryCode: user.countryCode,
        profilePhoto: user.profilePhoto,
        address: user.address,
      };
      await User.updateUser({
        user,
        id: user.id,
      });

      logger.info(`user ${userId} updated`);
      res.status(200).send({ user, success: true });
      return;
    } catch (err: any) {
      logger.error(err.message);
      throw new UpdateError('user is not updated');
    }
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset } = req.params;
  logger.info(`limit: ${limit}, offset: ${offset}`);
  try {
    if (!limit || !offset) {
      logger.error(`limit and offset are required`);
      throw new ValidationError('limit and offset are required');
    }
    const [allUsers, __] = await User.findAllUsers({
      limit: limit.toLocaleString(),
      offset: offset.toString(),
    });
    if (!allUsers || !allUsers.length) {
      logger.error(`no users found`);
      throw new NotFoundError('no users found');
    }
    logger.info(`users found`);
    res.status(200).send({ allUsers: allUsers, success: true });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};
const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    if (!id) {
      logger.error('user id is required');
      throw new ValidationError('user id is required');
    }
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      throw new NotFoundError('user not found');
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    const [result, _] = await User.updateUser({
      user: {
        ...userResult[0],
        otp,
      },
      id: Number(id),
    });
    if (result?.affectedRows) {
      const message = `Your OTP for Email Verification is ${otp}`;

      const sender = {
        email: 'foundoapplication@gmail.com',
        name: 'Foundo App',
      };
      const receivers = [
        {
          name: userResult[0].firstName + ' ' + userResult[0].lastName,
          email: userResult[0].email,
        },
      ];
      await sendTransactionalEmail({
        sender,
        to: receivers,
        subject: 'Verification OTP',
        textContent: `Verify your email by entering this OTP ${otp}`,
        htmlContent: `
          <h1>Foundo Application</h1>
          <h3>${message}</h3>`,
      });
      logger.info(`OTP sent to ${userResult[0].email}`);
      return res.status(200).send({ success: true, message: 'OTP sent' });
    }
    logger.error(`OTP sending failed for user ${id}`);
    throw new UpdateError('OTP sending failed');
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { id, otp } = req.params;
  try {
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      throw new ValidationError('user not found');
    }
    if (userResult[0].otp === Number(otp) && Number(otp) !== 0) {
      const [result, _] = await User.updateUser({
        user: {
          ...userResult[0],
          otp: 0,
          is_verified: 1,
        },
        id: Number(id),
      });

      if (result?.affectedRows) {
        logger.info(`Email of user ${id} verified`);
        return res.status(200).send({
          user: { ...userResult[0], otp: 0, is_verified: 1 },
          success: true,
          message: 'Your Email has been Verified Successfully !',
        });
      }
    }

    logger.error(`OTP didn't match for user ${id}`);
    throw new NotFoundError('OTP did not match');
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const resetOtp = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      throw new ValidationError('user not found');
    }
    const [result, _] = await User.updateUser({
      user: {
        ...userResult[0],
        otp: 0,
      },
      id: Number(id),
    });
    if (result?.affectedRows) {
      logger.info(`OTP reset for user ${id}`);
      return res.status(200).send({ success: true, message: 'OTP reset' });
    }

    logger.error(`OTP reset failed for user ${id}`);
    throw new UpdateError('OTP reset failed');
  } catch (err: any) {
    logger.error(err);
    next();
  }
};

export default {
  signupUser,
  signinUser,
  deleteUserById,
  getUserById,
  updateUserById,
  getAllUsers,
  sendOtp,
  verifyOtp,
  resetOtp,
};
