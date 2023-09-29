import User from '../models/User';
import UserSetting from '../models/UserSetting';
import promisePool from '../db';
const salt = process.env.SALT as string;
import bcrypt from 'bcrypt';
import utils from '../utils/index';
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const { S3Image } = require('../s3/S3image');
import logger from '../logger/logger';
import { Request, Response } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { RequestWithJwt } from '../types/types';
//create user | POST
const signupUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  let connection;
  try {
    if (!firstName || !lastName || !email || !password) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'firstName, lastName, email and password are required',
      });
      return;
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
    });
  } catch (err: any) {
    if (connection) connection.rollback();
    let errorMessage = err.message;
    if (err.errno === 1062) {
      errorMessage = 'This Email is already in use !';
    }
    logger.error(errorMessage);
    res.status(400).send({ error: 'Bad Request', errorMessage: errorMessage });
  } finally {
    if (connection) connection.release();
  }
};

//SignIn user
const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      logger.error(`email and password are required`);
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'email and password are required',
      });
      return;
    }
    const [user, _] = await User.findUserByEmail({ userEmail: email });

    if (!user || !user.length) {
      logger.error(`User with email ${email} not found`);
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
      });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      logger.error(`User ${user[0].id} entered wrong password`);
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'password is incorrect' });
      return;
    }
    const token = utils.createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken,
    });
    logger.info(`User ${user[0].id} logged in`);
    res.status(200).send({
      jwtToken: token,
      message: 'successfully loggedin',
      user: { ...user[0], password: '' },
    });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({
      error: 'server error',
      errorMessage: err.message,
      success: false,
    });
  }
};

//delete User based on userId | POST

const deleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    logger.error(`userId is required`);

    res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'userId is required' });
    return;
  }
  try {
    const [userResult, __] = await User.findUser({ id: userId });

    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${userId}`);
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
      return;
    }

    const [result, _] = await User.deleteUser({ userId });

    if (result.affectedRows) {
      logger.info(`user ${userId} deleted`);
      res.status(200).send({ user: userResult[0], success: true });
    } else {
      logger.error(`user ${userId} is not deleted`);
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user is not deleted' });
    }
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

// get user by user id | GET
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const reqJwt = req as RequestWithJwt;

  const userIdWhoMadeReq = reqJwt.jwt.id;

  if (!id) {
    logger.error(`userId is required`);
    res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'fk_userId is required' });
    return;
  }
  try {
    const [userResult, __] = await User.findUser({ id: Number(id) });
    const [userSettingResult, ___] = await UserSetting.findUserSetting({
      fk_userId: Number(id),
    });
    const userSetting = userSettingResult[0];

    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
      return;
    }
    let user = userResult[0];
    if (Number(userIdWhoMadeReq) !== user.id) {
      if (!userSetting.displayPhoneNo) user = { ...user, phoneNo: null };
      if (!userSetting.displayAddress) user = { ...user, address: null };
      if (!userSetting.displayProfilePhoto)
        user = { ...user, profilePhoto: null };
    }
    logger.info(`user ${id} found`);
    res.status(200).send({ user });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

// Update User by Id
const updateUserById = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const newProfilePhoto = req.body.profilePhoto;
  const newAddress = req.body.address;
  const newPhoneNo = req.body.phoneNo;
  const newCountryCode = req.body.countryCode;

  if (!userId) {
    logger.error(`userId is required`);
    res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'userId is required' });
    return;
  }

  try {
    const [userResult, __] = await User.findUser({ id: Number(userId) });
    if (!userResult || !userResult.length) {
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    }

    let user = userResult[0];

    if (newPhoneNo && user.phoneNo !== newPhoneNo) user.phoneNo = newPhoneNo;
    if (newCountryCode && user.countryCode !== newCountryCode)
      user.countryCode = newCountryCode;
    if (newProfilePhoto) {
      const s3ImageObj = new S3Image();

      try {
        await s3ImageObj.delete(user.profilePhoto);
        const location = await s3ImageObj.upload({
          id: userId,
          base64: newProfilePhoto,
          folderName: 'profilePhoto',
        });
        user.profilePhoto = location;
      } catch (err: any) {
        logger.error(err.message);
        return res.status(500).send({
          error: 'server error',
          errorMessage: err.message,
        });
      }
    }

    if (newAddress && user.address !== newAddress) user.address = newAddress;

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
      res.status(200).send({ user });
      return;
    } catch (err: any) {
      logger.error(err.message);
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user update failed ' });
      return;
    }
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const { limit, offset } = req.params;
  logger.info(`limit: ${limit}, offset: ${offset}`);
  try {
    if (!limit || !offset) {
      throw new Error('limit and offset are required');
    }
    const [allUsers, __] = await User.findAllUsers({
      limit: limit.toLocaleString(),
      offset: offset.toString(),
    });
    if (!allUsers || !allUsers.length) {
      logger.error(`no users found`);
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'no users' });
    }
    logger.info(`users found`);
    res.status(200).send({ allUsers: allUsers });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const sendOtp = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) {
      logger.error('user id is required');
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user id is required' });
      return;
    }
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
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
      await utils.sendTransactionalEmail({
        sender,
        to: receivers,
        subject: 'Verification OTP',
        textContent: `Verify your email by entering this OTP ${otp}`,
        htmlContent: `
          <h1>Foundo Application</h1>
          <h3>${message}</h3>`,
      });
      logger.info(`OTP sent to ${userResult[0].email}`);
      return res.status(200).send({ success: true });
    }
    return res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'user is not updated' });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const verifyOtp = async (req: Request, res: Response) => {
  const { id, otp } = req.params;
  try {
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
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

    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: `OTP Didn't Match`,
    });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const resetOtp = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [userResult, __] = await User.findUser({ id: Number(id) });
    if (!userResult || !userResult.length) {
      logger.error(`user not found with id ${id}`);
      return res.status(404).send({
        error: 'not found',
        errorMessage: 'user not found',
        success: false,
      });
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
      return res.status(200).send({ success: true });
    }

    logger.error(`OTP reset failed for user ${id}`);
    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: `Something went wrong`,
      success: false,
    });
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).send({
      error: 'server error',
      errorMessage: err.message,
      success: false,
    });
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
