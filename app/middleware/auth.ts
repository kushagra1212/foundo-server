const jwtSecret = process.env.JWT_SECRET;
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken as verifyTokenFromUtils } from '../utils';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    logger.error('Access denied. No token provided.');
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req['jwt'] = decoded;
    logger.info('Token verified.');
    next();
  } catch (err) {
    logger.error(err);
    res.status(400).json({ message: 'Invalid token.', success: false });
  }
};

const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, token } = req.params;

    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      logger.error('Please check your email again !');
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
        success: false,
      });
      return;
    }
    const decoded = verifyTokenFromUtils({
      jwtSecret: user[0].password,
      jwtToken: token,
    });

    req['user'] = user;
    req['decoded'] = decoded;
    logger.info('Token verified.');
    next();
  } catch (err) {
    logger.error(err.message);
    res.status(500).send({
      error: 'server error',
      errorMessage:
        'Reset password link is invalid or has expired. Please try again !',
      success: false,
    });
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const decoded = verifyTokenFromUtils({
      jwtSecret: jwtSecret,
      jwtToken: token,
    }) as jwt.JwtPayload;
    
    const [user, _] = await User.findUser({ id: decoded.id });
    if (!user || !user.length) {
      logger.error('Please check your email again !');
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
        success: false,
      });
      return;
    }
    req['user'] = user;
    req['decoded'] = decoded;
    logger.info('Token verified.');
    next();
  } catch (err) {
    logger.error(err);
    res
      .status(500)
      .send({
        error: 'server error',
        errorMessage: err.message,
        success: false,
      });
  }
};

export default {
  auth,
  verifyResetToken,
  verifyToken,
};
