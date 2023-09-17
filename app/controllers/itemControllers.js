const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
const { S3Image } = require('../s3/S3image');
const ItemManager = require('./utility');
const ItemMatcher = require('../ai/matchingLogic');
const itemManager = new ItemManager();
const itemMatcher = new ItemMatcher();

const addItem = async (req, res) => {
  const result = await itemManager.addItem(req.body);
  res.status(result.statusCode).send(result);
};

const deleteItemByItemId = async (req, res) => {
  const { itemId } = req.body;
  let connection;
  try {
    const [itemResult, __] = await Item.findItem({ itemId });
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    await ItemPicture.deletePictures({ itemId });
    await ItemLocation.deleteLocation({ itemId });
    await Item.deleteItem({ itemId });
    await connection.commit();
    res
      .status(200)
      .send({ itemId, message: 'deleted successfully', success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  } finally {
    if (connection) connection.release();
  }
};
const getItemByItemId = async (req, res) => {
  const { id } = req.params;
  const result = await itemManager.getItemDetails(id);

  if (!result.success) {
    res.status(result.statusCode).send(result);
    return;
  }

  res.status(result.statusCode).send(result);
};

const updateItemById = async (req, res) => {
  const { itemId, description } = req.body;
  if (!itemId) {
    return res
      .status(400)
      .send({ error: 'error', errorMessage: 'itemId is not provided' });
  }
  if (description === undefined) {
    return res
      .status(400)
      .send({ error: 'error', errorMessage: 'Description is not provided' });
  }
  try {
    const [itemResult, __] = await Item.findItem({ itemId });
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    await Item.updateItem(itemId, 'description', description);
    res
      .status(200)
      .send({ success: true, mesage: 'item updated Successfully' });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const getItemsbyUserId = async (req, res) => {

  const { userId } = req.query;

  if (!userId) {
    res.status(400).send({
      success: false,
      errorMessage: 'userId is required',
    });
    return;
  }

  req.query.userId = parseInt(userId);

  const result = await itemManager.getAllItems(req.query);

  return res.status(result.statusCode).send(result);
};

const getItems = async (req, res) => {
  const result = await itemManager.getAllItems(req.query);

  return res.status(result.statusCode).send(result);
};
const getItemsBySearchString = async (req, res) => {
  const { limit, offset, searchstring } = req.query;

  if (
    offset === undefined ||
    limit === undefined ||
    searchstring === undefined
  ) {
    res.status(400).send({
      success: false,
      errorMessage: 'offset, limit and search string are required',
    });
    return;
  }
  try {
    const [[finalResult], [count]] = await Item.findItemBySearchStringRegExp({
      searchString: searchstring,
      offset,
      limit,
    });
    if (!finalResult || !finalResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'items not found' });
      return;
    }
    res.status(200).send({ total: count[0].total, items: finalResult });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const getMatchesByItemId = async (req, res) => {
  const { itemID } = req.params;
  const result = await itemManager.getItemDetails(itemID);

  if (!result.success) {
    res.status(result.statusCode).send(result);
    return;
  }
  const { description } = result.item;

  const itemResult = await itemManager.getAllItems({
    offset: '0',
    limit: '100',
  });
  if (!itemResult.success) {
    res.status(itemResult.statusCode).send(itemResult);
    return;
  }

  const { items } = itemResult;

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
};

const getMatchedPosts = async (req, res) => {
  const {userIds} = req.body;
  if(!userIds) {
    res.status(400).send({
      success: false,
      errorMessage: 'userIds are required',
    });
    return;
  }


  const totalCount = userIds.length;
  const promises = [];

  for(let i = 0; i < totalCount; i++) {
    promises.push(itemManager.getItemDetails(userIds[i]));
  }

  try{
      const results = await Promise.allSettled(promises);
      const items = [];
      results.forEach((result, index) => {
        if(result.status === 'rejected') {
          return res.status(500).send({error: 'server error', errorMessage: result.reason.message,success:false});
        }else {
          items.push(result.value.item);
        }
      });

      return res.status(200).send(items);
  }catch(err) {
    return res.status(500).send({error: 'server error', errorMessage: err.message,success:false});
  }


}

module.exports = {
  addItem,
  deleteItemByItemId,
  getItemByItemId,
  updateItemById,
  getItemsbyUserId,
  getItems,
  getItemsBySearchString,
  getMatchesByItemId, 
  getMatchedPosts
};
