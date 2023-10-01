import { NextFunction, Request, Response } from 'express';
import promisePool from '../db';
import Message from '../models/Message';
import { ValidationError } from '../custom-errors/customErrors';
import { messageType } from '../types/types';
import logger from '../logger/logger';
import Location from '../models/Location';
import MessageLocation from '../models/MessageLocation';
import ContactMessage from '../models/ContactMessage';
import { log } from 'console';

const addMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fk_senderId, fk_receiverId, message } = req.body;
    if (!fk_senderId || !fk_receiverId || !message) {
      throw new ValidationError('Missing required fields');
    }
    const createdMessage = new Message(req.body);
    const [rows, _] = await createdMessage.save();

    res.status(200).send({ success: true, messageId: rows.insertId });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const addContactMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let connection = null;
  try {
    const { location, isFound, isPhoneNoShared } = req.body;

    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    logger.info('Transaction started');

    const [createdMessage, _] = await new Message(req.body.baseMessage).save();
    const messageId = createdMessage.insertId;

    if (location) {
      const [rows, _] = await new Location(location).save();
      const locationId = rows.insertId;
      await new MessageLocation({
        fk_messageId: messageId,
        fk_locationId: Number(locationId),
      }).save();
    }

    await new ContactMessage({
      fk_messageId: messageId,
      isFound,
      isPhoneNoShared,
    }).save();

    await connection.commit();
    logger.info('Transaction committed');

    res.status(200).send({ success: true, messageId });
  } catch (err) {
    logger.error(err);
    if (connection) {
      await connection.rollback();
      logger.info('Transaction rolled back');
    }
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

const getContactList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fk_receiverId, limit, offset } = req.params;
    if (!fk_receiverId || !limit || !offset) {
      throw new ValidationError('Missing required fields');
    }
    const [rows, _] = await Message.getContactList({
      fk_receiverId: Number(fk_receiverId),
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).send(rows);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fk_senderId, fk_receiverId, limit, offset } = req.params;

    if (!fk_senderId || !fk_receiverId || limit==undefined  || offset==undefined ) {
      throw new ValidationError('Missing required fields');
    }

    const [rows, _] = await Message.getMessages({
      fk_senderId: Number(fk_senderId),
      fk_receiverId: Number(fk_receiverId),
      limit: Number(limit),
      offset: Number(offset),
    });
    res.status(200).send(rows);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export default {
  addMessage,
  addContactMessage,
  getContactList,
  getMessages,
};
