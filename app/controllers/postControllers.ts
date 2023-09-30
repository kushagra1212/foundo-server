import ItemLocation from '../models/ItemLocation';
import ItemPicture from '../models/ItemPicture';
import promisePool from '../db';
import itemManager from './utility';
import ItemMatcher from '../ai/matchingLogic';
import { NextFunction, Request, Response } from 'express';
import logger from '../logger/logger';
import Item from '../models/Item';
import { NotFoundError, ValidationError } from '../custom-errors/customErrors';
const itemMatcher = new ItemMatcher();

const getItemByItemId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await itemManager.getItemDetails(id);
    return res.status(200).send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemManager.addItem(req.body);
    return res.status(201).send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const deleteItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    await Item.deleteItem({ id });
    await connection.commit();

    res
      .status(200)
      .send({ id, message: 'deleted successfully', success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    logger.error(err);
    next(err);
  } finally {
    if (connection) connection.release();
  }
};

const updateItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: itemId } = req.params;
    const { description } = req.body;
    if (!itemId) {
      throw new ValidationError('itemId is required');
    }
    if (description === undefined) {
      throw new ValidationError('description is required');
    }

    await Item.updateItem(Number(itemId), 'description', description);
    res
      .status(200)
      .send({ success: true, mesage: 'item updated Successfully' });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getItemsbyUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new ValidationError('userId is required');
    }
    req.query.userId = userId;
    const result = await itemManager.getAllItems(req.query);
    return res.status(200).send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await itemManager.getAllItems(req.query);
    return res.status(200).send(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
const getItemsBySearchString = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { limit, offset, searchstring } = req.query;

  try {
    if (!offset || !limit || !searchstring) {
      throw new ValidationError('offset, limit and searchstring are required');
    }

    const [[finalResult], [count]] = await Item.findItemBySearchStringRegExp({
      searchString: String(searchstring),
      offset: Number(offset),
      limit: Number(limit),
    });

    if (!finalResult || !finalResult.length) {
      throw new NotFoundError('No items found');
    }

    res
      .status(200)
      .send({ total: count[0].total, items: finalResult, success: true });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getMatchesByItemId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemId } = req.params;
    const result = await itemManager.getItemDetails(itemId);
    const { description } = result.item;
    const { items } = await itemManager.getAllItems({
      offset: '0',
      limit: '100',
    });
    let foundItems = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].isFounded === 1) {
        foundItems.push(items[i]);
      }
    }
    const matches = itemMatcher.matchItems({
      lostItem: result.item,
      foundItems,
    });

    res.status(200).send({ matches });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};


export default {
  getItemByItemId,
  addItem,
  deleteItemById,
  updateItemById,
  getItemsbyUserId,
  getItems,
  getItemsBySearchString,
  getMatchesByItemId,
};
