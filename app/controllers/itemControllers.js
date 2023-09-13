const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
const { S3Image } = require('../s3/S3image');
const ItemDetailsGetter = require('./utility');
const ItemMatcher = require('../ai/matchingLogic');
const itemDetailsGetter = new ItemDetailsGetter();
const itemMatcher = new ItemMatcher();
const addLostItem = async (req, res) => {
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
  } = req.body;
  const item = new Item({
    itemName,
    color,
    dateTime,
    description,
    brand,
    city,
    category,
    userId,
    isFounded: false,
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
    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: 'Please fill all the fields',
    });
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [lostItem, _] = await item.save();
    const s3ImageObj = new S3Image();
    let picturesArray = [];
    for (let i = 0; i < pictures.length; i++) {
      const pic = await s3ImageObj.upload({
        id: lostItem.insertId,
        base64: pictures[i].image,
        folderName: 'lostItems',
      });
      picturesArray.push({ image: pic });
    }
    const itemPicture = new ItemPicture({
      pictures: picturesArray,
      lostItemId: lostItem.insertId,
      foundItemId: null,
    });
    await itemPicture.save();
    const itemLocation = new ItemLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      lostItemId: lostItem.insertId,
      foundItemId: null,
    });
    await itemLocation.save();
    await Item.updateItem(
      lostItem.insertId,
      'thumbnail',
      picturesArray[0].image
    );
    await connection.commit();
    res.status(200).send({ itemId: lostItem.insertId, success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  } finally {
    if (connection) connection.release();
  }
};
const addFoundedItem = async (req, res) => {
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
  } = req.body;
  const item = new Item({
    itemName,
    color,
    dateTime,
    description,
    brand,
    city,
    category,
    userId,
    isFounded: true,
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
    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: 'Please fill all the fields',
    });

  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [foundedItem, _] = await item.save();
    const s3ImageObj = new S3Image();
    let picturesArray = [];
    for (let i = 0; i < pictures.length; i++) {
      const pic = await s3ImageObj.upload({
        id: foundedItem.insertId,
        base64: pictures[i].image,
        folderName: 'foundItems',
      });
      picturesArray.push({ image: pic });
    }

    const itemPicture = new ItemPicture({
      pictures: picturesArray,
      lostItemId: null,
      foundItemId: foundedItem.insertId,
    });
    await itemPicture.save();
    const itemLocation = new ItemLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      lostItemId: null,
      foundItemId: foundedItem.insertId,
    });
    await Item.updateItem(
      foundedItem.insertId,
      'thumbnail',
      picturesArray[0].image
    );
    await itemLocation.save();

    await connection.commit();
    res.status(200).send({ itemId: foundedItem.insertId, success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  } finally {
    if (connection) connection.release();
  }
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
  const result = await itemDetailsGetter.getItemDetails(id);

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
  const { limit, offset } = req.query;
  if (offset === undefined || limit === undefined) {
    res
      .status(400)
      .send({ success: false, errorMessage: 'offset and limit required' });
    return;
  }

  try {
    const [itemResult, _] = await Item.findItemsByUserIdorAll(req.query);
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'items not found' });
      return;
    }
    res.status(200).send({ items: itemResult });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const getItems = async (req, res) => {
  const result = await itemDetailsGetter.getAllItems(req.query);

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
  const result = await itemDetailsGetter.getItemDetails(itemID);

  if (!result.success) {
    res.status(result.statusCode).send(result);
    return;
  }
  const { description } = result.item;

  const itemResult = await itemDetailsGetter.getAllItems({
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

module.exports = {
  addLostItem,
  addFoundedItem,
  deleteItemByItemId,
  getItemByItemId,
  updateItemById,
  getItemsbyUserId,
  getItems,
  getItemsBySearchString,
  getMatchesByItemId,
};
