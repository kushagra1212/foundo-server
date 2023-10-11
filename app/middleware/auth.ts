const jwtSecret = process.env.JWT_SECRET;
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyToken as verifyTokenFromUtils } from '../utils';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';
import { UnauthorizedError, ValidationError } from '../custom-errors/customErrors';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    logger.error('Access denied. No token provided.');
    throw new UnauthorizedError('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req['jwt'] = decoded;
    logger.info('Token verified.');
    next();
  } catch (err) {
    logger.error(err);
    next(err);
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
      throw new ValidationError('Please check your email again !');
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
    logger.error(err);
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
      throw new ValidationError('Please check your email again !');
    }
    req['user'] = user;
    req['decoded'] = decoded;
    logger.info('Token verified.');
    next();
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default {
  auth,
  verifyResetToken,
  verifyToken,
};
