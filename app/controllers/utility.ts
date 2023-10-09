import { NotFoundError, ValidationError } from '../custom-errors/customErrors';

// utility.js
import ItemPicture from '../models/ItemPicture';
import promisePool from '../db';
import S3Image from '../s3/S3image';
import { ImageType } from '../types/types';
import ItemLocation from '../models/ItemLocation';
import Location from '../models/Location';
import Item from '../models/Item';
import logger from '../logger/logger';
import ItemMatcher from '../ai/matchingLogic';

class ItemManager {
  static async getItemDetails(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!id) {
          throw new ValidationError('id is required');
        }
        const [itemResult, __] = await Item.findItem({ itemId: id });
        if (!itemResult || !itemResult.length) {
          throw new NotFoundError('item not found');
        }
        const [picturesResults, _] = await ItemPicture.getPictures({
          fk_itemId: id,
          limit: '3',
          offset: '0',
        });
        const [locationResults, ___] =
          await ItemLocation.getCompleteLocationByItemId({
            fk_itemId: id,
          });

        resolve({
          item: {
            ...itemResult[0],
            itemPictures: picturesResults,
            itemLocation: locationResults[0],
          },
          success: true,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async getAllItems(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { limit, offset } = query;
        if (offset === undefined || limit === undefined) {
          throw new ValidationError('offset and limit are required');
        }
        const [itemResult, _] = await Item.findItemsByUserIdorAll(query);
        if (!itemResult || !itemResult.length) {
          throw new NotFoundError('item not found');
        }
        resolve({
          items: itemResult,
          success: true,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async addItem(body) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        const {
          itemName,
          color,
          dateTime,
          description,
          brand,
          city,
          category,
          fk_userId,
          isFounded,
          pictures,
          location,
        } = body;
        const item = new Item({
          itemName,
          color,
          dateTime,
          description,
          brand,
          city,
          category,
          fk_userId,
          isFounded,
        });

        if (
          !itemName ||
          !color ||
          !dateTime ||
          !description ||
          !brand ||
          !city ||
          !category ||
          !fk_userId ||
          !pictures ||
          !location
        ) {
          throw new ValidationError('All fields are required');
        }

        connection = await promisePool.getConnection();
        await connection.beginTransaction();
        logger.info('connection started');

        // Save item
        const [savedItem, _] = await item.save();
        const s3ImageObj = new S3Image();

        // Save pictures
        let picturesArray: ImageType[] = [];
        for (let i = 0; i < pictures.length; i++) {
          const pic = await s3ImageObj.upload({
            id: savedItem.insertId,
            base64: pictures[i].image,
            folderName: isFounded ? 'foundItems' : 'lostItems',
          });
          picturesArray.push({ image: pic });
        }
        const itemPicture = new ItemPicture({
          pictures: picturesArray,
          fk_itemId: savedItem.insertId,
        });
        await itemPicture.save();

        // Save location
        const createLocation = new Location({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        const [savedLocation, __] = await createLocation.save();
        // Save item location

        const itemLocation = new ItemLocation({
          fk_itemId: savedItem.insertId,
          fk_locationId: savedLocation.insertId,
        });
        await itemLocation.save();

        // Update item with thumbnail
        await Item.updateItem(
          savedItem.insertId,
          'thumbnail',
          picturesArray[0].image,
        );

        await connection.commit();
        logger.info('connection commited');
        resolve({
          success: true,
          message: 'item added successfully',
          itemId: savedItem.insertId,
        });
      } catch (err) {
        if (connection) {
          await connection.rollback();
          logger.info('connection rolled back');
        }
        reject(err);
      } finally {
        if (connection) {
          logger.info('connection released');
          connection.release();
        }
      }
    });
  }

  static async getItemsByPostIds(postIds: number[]) {
    return new Promise(async (resolve, reject) => {
      try {
        const [itemResult, _] = await Item.findItemsByPostIds(postIds);
        if (!itemResult || !itemResult.length) {
          throw new NotFoundError('item not found');
        }
        resolve({
          items: itemResult,
          success: true,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  static async getMatchedItems(itemId: number):Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await ItemManager.getItemDetails(itemId);
        const { description } = result.item;
        const { items } = await ItemManager.getAllItems({
          offset: '0',
          limit: '100',
        });
        let foundItems = [];

        for (let i = 0; i < items.length; i++) {
          if (items[i].isFounded === 1) {
            foundItems.push(items[i]);
          }
        }
        const itemMatcher = new ItemMatcher();
        const matches = itemMatcher.matchItems({
          lostItem: result.item,
          foundItems,
        });

        resolve(matches);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default ItemManager;
