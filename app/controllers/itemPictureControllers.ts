import { NextFunction, Request, Response } from 'express';

import Item from '../models/Item';
import ItemPicture from '../models/ItemPicture';
import { NotFoundError, ValidationError } from '../custom-errors/customErrors';
import logger from '../logger/logger';

const getItemPicturesByItemId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { itemId } = req.params;
    const { limit, offset } = req.query;
    if (!limit || !offset || !itemId) {
      throw new ValidationError('limit, offset, itemId are required');
    }
    const [picturesResult, _] = await ItemPicture.getPictures({
      limit,
      offset,
      fk_itemId: itemId,
    });

    if (!picturesResult?.length) {
      throw new NotFoundError('pictures not found');
    }

    res.status(200).send({ pictures: picturesResult, success: true });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};

const addPictures = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId, pictures } = req.body;
    if (!itemId) {
      throw new ValidationError('itemId is required');
    }
    const [itemResult, __] = await Item.findItem({ itemId });
    if (!itemResult || !itemResult.length) {
      throw new NotFoundError('item not found');
    }
    const itemPictures = new ItemPicture({
      pictures,
      fk_itemId: itemId,
    });
    await itemPictures.save();
    res
      .status(200)
      .send({ success: true, message: 'pictures added successfully' });
  } catch (err) {
    logger.error(err.message);
    next(err);
  }
};
export default {
  getItemPicturesByItemId,
  addPictures,
};
