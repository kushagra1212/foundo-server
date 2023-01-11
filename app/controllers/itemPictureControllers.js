const Item = require('../models/Item');
const ItemPicture = require('../models/ItemPicture');

const getItemPictures = async (req, res) => {
  const { limit, offset, itemId } = req.query;
  if (!limit || !offset || !itemId) {
    res.status(400).send({
      error: 'bad request',
      errorMessage: 'limit, offset and itemId are required',
    });
    return;
  }
  try {
    const [picturesResult, _] = await ItemPicture.getPictures({
      limit,
      offset,
      itemId,
    });
    if (picturesResult?.length)
      res.status(200).send({ pictures: picturesResult, success: true });
    else
      res
        .status(404)
        .send({ error: 'not found', errMessage: 'Pictures not found' });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const addPictures = async (req, res) => {
  const { itemId, pictures, isFounded } = req.body;
  if (!itemId) {
    res
      .status(400)
      .send({ error: 'bad request', errorMessage: 'itemId is required' });
    return;
  }
  try {
    const [itemResult, __] = await Item.findItem({ itemId });
    if (!itemResult || !itemResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    const itemPictures = new ItemPicture({
      pictures,
      foundItemId: isFounded ? itemId : null,
      lostItemId: isFounded ? null : itemId,
    });
    await itemPictures.save();
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
module.exports = {
  getItemPictures,
  addPictures,
};
