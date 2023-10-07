import { NextFunction, Request, Response } from 'express';
import UserSetting from '../models/UserSetting';
import logger from '../logger/logger';
import { NotFoundError, ValidationError } from '../custom-errors/customErrors';
import { RequestWithJwt } from '../types/types';

const getUserSettingByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      logger.error('userId is required');
      throw new ValidationError('userId is required');
    }
    const [userSettingResult, __] = await UserSetting.findUserSetting({
      fk_userId: Number(userId),
    });
    if (!userSettingResult || !userSettingResult.length) {
      logger.error(`user setting not found for userId ${userId}`);
      throw new NotFoundError('user setting not found');
    }

    logger.info(`user Setting found for userId ${userId}`);
    res.status(200).send({ userSetting: userSettingResult[0], success: true });
  } catch (err) {
    logger.error(`user Setting update failed for userId ${userId}`);
    next(err);
  }
};

const updateUserSettingbyUserId = async (
  req: RequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const idFromJwt = req.jwt.id;
  
  try {

    if (!userId) {
      logger.error('userId is required');
      throw new ValidationError('userId is required');
    }

    if (Number(idFromJwt) !== Number(userId)) {
      logger.error('userId is not matching with jwt id');
      throw new ValidationError('userId is not matching with jwt id');
    }

    const result = await UserSetting.updateUserSettingByUserId({
      userSetting: req.body,
      fk_userId: Number(userId),
    });

    logger.info(`user Setting updated for userId ${userId}`);
    return res.status(200).send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default {
  updateUserSettingbyUserId,
  getUserSettingByUserId,
};
