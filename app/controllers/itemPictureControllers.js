const Item = require('../models/Item');
const ItemPicture = require('../models/ItemPicture');
const { S3Image } = require('../s3/S3image');

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

const updateItemPictureUrl = async (req, res) => {
  try {
    const [pictureResult, __] = await ItemPicture.getAllPictures();
    if (!pictureResult || !pictureResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'item not found' });
      return;
    }
    const s3ImageObj = new S3Image();
    for (let i = 0; i < pictureResult.length; i++) {
      const picture = pictureResult[i];
      // const res = await toDataURLWithPromise(picture.url);
      const res = picture.url;
      const url = await s3ImageObj.upload({
        id: picture.id,
        base64: res,
        folderName: picture?.lostItemId ? LOSTITEMS : FOUNDITEMS,
      });
      console.log(url);
      await ItemPicture.updateURL({
        id: picture.id,
        url,
      });
    }
    const [pictureResult2, ___] = await ItemPicture.getAllPictures();
    res.status(200).send({ pictureResult2 });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

module.exports = {
  getItemPictures,
  addPictures,
  updateItemPictureUrl,
};
