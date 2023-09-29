var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Item = require('../models/Item');
const ItemPicture = require('../models/ItemPicture');
const { S3Image } = require('../s3/S3image');
const getItemPictures = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { limit, offset, itemId } = req.query;
    if (!limit || !offset || !itemId) {
        res.status(400).send({
            error: 'bad request',
            errorMessage: 'limit, offset and itemId are required',
        });
        return;
    }
    try {
        const [picturesResult, _] = yield ItemPicture.getPictures({
            limit,
            offset,
            itemId,
        });
        if (picturesResult === null || picturesResult === void 0 ? void 0 : picturesResult.length)
            res.status(200).send({ pictures: picturesResult, success: true });
        else
            res
                .status(404)
                .send({ error: 'not found', errMessage: 'Pictures not found' });
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const addPictures = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { itemId, pictures, isFounded } = req.body;
    if (!itemId) {
        res
            .status(400)
            .send({ error: 'bad request', errorMessage: 'itemId is required' });
        return;
    }
    try {
        const [itemResult, __] = yield Item.findItem({ itemId });
        if (!itemResult || !itemResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'item not found' });
            return;
        }
        const itemPictures = new ItemPicture({
            pictures,
            itemId
        });
        yield itemPictures.save();
        res.status(200).send({ success: true });
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const updateItemPictureUrl = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const [pictureResult, __] = yield ItemPicture.getAllPictures();
        if (!pictureResult || !pictureResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'item not found' });
            return;
        }
        const s3ImageObj = new S3Image();
        for (let i = 0; i < pictureResult.length; i++) {
            const picture = pictureResult[i];
            const res = picture.url;
            const url = yield s3ImageObj.upload({
                id: picture.id,
                base64: res,
                folderName: (picture === null || picture === void 0 ? void 0 : picture.lostItemId) ? LOSTITEMS : FOUNDITEMS,
            });
            yield ItemPicture.updateURL({
                id: picture.id,
                url,
            });
        }
        const [pictureResult2, ___] = yield ItemPicture.getAllPictures();
        res.status(200).send({ pictureResult2 });
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
module.exports = {
    getItemPictures,
    addPictures,
    updateItemPictureUrl,
};
//# sourceMappingURL=itemPictureControllers.js.map