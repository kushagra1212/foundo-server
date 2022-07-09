const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
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
  });
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [lostItem, _] = await item.save();
    const itemPicture = new ItemPicture({
      pictures,
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
    await connection.commit();
    res.status(200).send({ itemId: lostItem.insertId, success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  } finally {
    if (connection) await connection.release();
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
  });
  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [foundedItem, _] = await item.save();
    const itemPicture = new ItemPicture({
      pictures,
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
  try {
    const [itemResult, __] = await Item.findItem({ itemId: id });
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    const [picturesResults, _] = await ItemPicture.getPictures({
      itemId: id,
      limit: '3',
      offset: '0',
    });
    const [locationResults, ___] = await ItemLocation.getLocation({
      itemId: id,
    });
    res.status(200).send({
      item: {
        ...itemResult[0],
        itemPictures: picturesResults,
        itemLocation: locationResults[0],
      },
      success: true,
    });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const updateItemById = async (req, res) => {
  const { itemId, description } = req.body;
  try {
    const [itemResult, __] = await Item.findItem({ itemId });
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    await Item.updateItem({ itemId, description });
    res
      .status(200)
      .send({ success: true, mesage: 'item updated Successfully' });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const getItemsbyUserId = async (req, res) => {
  const { limit, offset } = req.query;
  console.log(req.query);
  if (offset === undefined || limit === undefined) {
    res
      .status(400)
      .send({ success: false, errorMessage: 'offset and limit required' });
    return;
  }

  try {
    const [itemResult, _] = await Item.findItemsByUserId(req.query);
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    res.status(200).send({ items: itemResult });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

module.exports = {
  addLostItem,
  addFoundedItem,
  deleteItemByItemId,
  getItemByItemId,
  updateItemById,
  getItemsbyUserId,
};
