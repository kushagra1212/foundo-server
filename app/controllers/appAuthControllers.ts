import User from '../models/User';
const salt = process.env.SALT;
import bcrypt from 'bcrypt';
import { createToken, sendTransactionalEmail } from '../utils';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';
import { RequestWithJwt, UserType } from '../types/types';
import { NotFoundError, ValidationError } from '../custom-errors/customErrors';
const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.params;
    if (!email) {
      logger.error(`email is not provided`);
      throw new ValidationError('please provide email !');
    }
    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      logger.error(`email is not found`);
      throw new NotFoundError('please check your email address again !');
    }
    const maxAgeOfJWTToken = 60 * 60 * 24 * 6; // Validity 6 Hour Only
    /* Taking old password as a secret [dynamic]
       Will be Validating while taking NewPassword       
    */
    const _user = user[0] as UserType;

    const jwtSecret = _user.password;
    const token = createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken: maxAgeOfJWTToken,
    });
    const sender = {
      email: 'foundoapplication@gmail.com',
      name: 'Foundo App',
    };
    const receivers = [
      {
        name: user[0].name,
        email: email,
      },
    ];
    let resetPasswordLink = `${process.env.RESET_PASS_APP_URL}`;
    await sendTransactionalEmail({
      sender,
      to: receivers,
      subject: 'Foundo! Reset Your Password',
      textContent: `Reset Password Link`,
      htmlContent: `
          <h1>Foundo Application</h1>
          <h3>Here is your reset password Link</h3>
          <a href="${resetPasswordLink}/${email}/${token}">Reset Password</a>`,
    });
    logger.info(`email sent successfully`);
    res.status(200).send({ message: 'Email sent successfully', success: true });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const checkValidityofToken = async (
  req: RequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info(`Token verified.`);
    return res
      .status(200)
      .send({ ...req.decoded, user: req.user[0], success: true });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};
const resetPassword = async (
  req: RequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    if (!password) {
      logger.error(`password is not provided`);
      throw new ValidationError('please provide password !');
    }

    let hashedPassword = await bcrypt.hash(password, parseInt(salt));
    const [user, _] = await User.changePassword({
      email: req?.user[0]?.email,
      password: hashedPassword,
    });
    logger.info(`Password Changed Successfully for userId: ${user?.id}`);
    res.send({
      user,
      message: 'Password Changed Successfully !',
      success: true,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
export default {
  forgotPassword,
  checkValidityofToken,
  resetPassword,
};
