// utility.js
const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
const { S3Image } = require('../s3/S3image');
class ItemManager {
  constructor() {
    // You can add any constructor logic if needed
  }

  async getItemDetails(id) {
    if (!id) {
      return {
        error: 'error',
        errorMessage: 'id is not provided',
        success: false,
        statusCode: 400,
      };
    }
    try {
      const [itemResult, __] = await Item.findItem({ itemId: id });
      if (!itemResult || !itemResult.length) {
        return {
          error: 'not found',
          errorMessage: 'item not found',
          success: false,
          statusCode: 404,
        };
      }
      const [picturesResults, _] = await ItemPicture.getPictures({
        itemId: id,
        limit: '3',
        offset: '0',
      });
      const [locationResults, ___] = await ItemLocation.getLocation({
        itemId: id,
      });
      return {
        item: {
          ...itemResult[0],
          itemPictures: picturesResults,
          itemLocation: locationResults[0],
        },
        success: true,
        statusCode: 200,
      };
    } catch (err) {
      return {
        error: 'server error',
        errorMessage: err.message,
        success: false,
        statusCode: 500,
      };
    }
  }
  async getAllItems(query) {
    const { limit, offset } = query;

    if (offset === undefined || limit === undefined) {
      return {
        success: false,
        errorMessage: 'offset and limit required',
        statusCode: 400,
      };
    }

    try {
      const [itemResult, _] = await Item.findItemsByUserIdorAll(query);
      if (!itemResult || !itemResult.length) {
        return {
          error: 'not found',
          errorMessage: 'items not found',
          success: false,
          statusCode: 404,
        };
      }
      return { items: itemResult, success: true, statusCode: 200 };
    } catch (err) {
      return {
        error: 'server error',
        errorMessage: err.message,
        success: false,
        statusCode: 500,
      };
    }
  }

  async addItem(body) {
    const {
    itemName,
    color,
    dateTime,
    description,
    brand,
    city,
    category,
    userId,
    isFounded,
    pictures,
    location,
    college,
  } = body;
  const item = new Item({
    itemName,
    color,
    dateTime,
    description,
    brand,
    city,
    category,
    userId,
    isFounded,
    college,
  });

  if (
    !itemName ||
    !color ||
    !dateTime ||
    !description ||
    !brand ||
    !city ||
    !category ||
    !userId ||
    !pictures ||
    !location
  )
    return ({
      error: 'Bad Request',
      errorMessage: 'Please fill all the fields',
      success: false,
      statusCode: 400,
    });
  let connection;
  let result;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [savedItem, _] = await item.save();
    console.log(savedItem)
    const s3ImageObj = new S3Image();
    let picturesArray = [];
    for (let i = 0; i < pictures.length; i++) {
      const pic = await s3ImageObj.upload({
        id: savedItem.insertId,
        base64: pictures[i].image,
        folderName: (isFounded?'foundItems':'lostItems'),
      });
      picturesArray.push({ image: pic });
    }
    const itemPicture = new ItemPicture({
      pictures: picturesArray,
      itemId: savedItem.insertId
    });
    await itemPicture.save();
    const itemLocation = new ItemLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      itemId: savedItem.insertId
    });
    await itemLocation.save();
    await Item.updateItem(
      savedItem.insertId,
      'thumbnail',
      picturesArray[0].image
    );
    await connection.commit();
    result = ({ itemId: savedItem.insertId, success: true ,statusCode:200});
  } catch (err) {
    if (connection) await connection.rollback();
    result = ({ error: 'Bad Request', errorMessage: err.message,success: false,statusCode:400 });
  } finally {
    if (connection) connection.release();
  }

  return result;
  }
}


module.exports = ItemManager;
