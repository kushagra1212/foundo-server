// utility.js
const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');

class ItemDetailsGetter {
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
}

module.exports = ItemDetailsGetter;
