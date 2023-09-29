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
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
const { S3Image } = require('../s3/S3image');
const ItemManager = require('./utility');
const ItemMatcher = require('../ai/matchingLogic');
const itemManager = new ItemManager();
const itemMatcher = new ItemMatcher();
const addItem = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const result = yield itemManager.addItem(req.body);
    res.status(result.statusCode).send(result);
});
const deleteItemByItemId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { itemId } = req.params;
    let connection;
    try {
        const [itemResult, __] = yield Item.findItem({ itemId });
        if (!itemResult || !itemResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'item not found' });
            return;
        }
        connection = yield promisePool.getConnection();
        yield connection.beginTransaction();
        yield ItemPicture.deletePictures({ itemId });
        yield ItemLocation.deleteLocation({ itemId });
        yield Item.deleteItem({ itemId });
        yield connection.commit();
        res
            .status(200)
            .send({ itemId, message: 'deleted successfully', success: true });
    }
    catch (err) {
        if (connection)
            yield connection.rollback();
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
    finally {
        if (connection)
            connection.release();
    }
});
const getItemByItemId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield itemManager.getItemDetails(id);
    if (!result.success) {
        res.status(result.statusCode).send(result);
        return;
    }
    res.status(result.statusCode).send(result);
});
const updateItemById = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        const [itemResult, __] = yield Item.findItem({ itemId });
        if (!itemResult || !itemResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'item not found' });
            return;
        }
        yield Item.updateItem(itemId, 'description', description);
        res
            .status(200)
            .send({ success: true, mesage: 'item updated Successfully' });
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const getItemsbyUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userId } = req.query;
    if (!userId) {
        res.status(400).send({
            success: false,
            errorMessage: 'userId is required',
        });
        return;
    }
    req.query.userId = parseInt(userId);
    const result = yield itemManager.getAllItems(req.query);
    return res.status(result.statusCode).send(result);
});
const getItems = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const result = yield itemManager.getAllItems(req.query);
    return res.status(result.statusCode).send(result);
});
const getItemsBySearchString = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { limit, offset, searchstring } = req.query;
    if (offset === undefined ||
        limit === undefined ||
        searchstring === undefined) {
        res.status(400).send({
            success: false,
            errorMessage: 'offset, limit and search string are required',
        });
        return;
    }
    try {
        const [[finalResult], [count]] = yield Item.findItemBySearchStringRegExp({
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
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const getMatchesByItemId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { itemID } = req.params;
    const result = yield itemManager.getItemDetails(itemID);
    if (!result.success) {
        res.status(result.statusCode).send(result);
        return;
    }
    const { description } = result.item;
    const itemResult = yield itemManager.getAllItems({
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
});
const getMatchedPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userIds } = req.body;
    if (!userIds) {
        res.status(400).send({
            success: false,
            errorMessage: 'userIds are required',
        });
        return;
    }
    const totalCount = userIds.length;
    const promises = [];
    for (let i = 0; i < totalCount; i++) {
        promises.push(itemManager.getItemDetails(userIds[i]));
    }
    try {
        const results = yield Promise.allSettled(promises);
        const items = [];
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                return res.status(500).send({ error: 'server error', errorMessage: result.reason.message, success: false });
            }
            else {
                items.push(result.value.item);
            }
        });
        return res.status(200).send(items);
    }
    catch (err) {
        return res.status(500).send({ error: 'server error', errorMessage: err.message, success: false });
    }
});
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
//# sourceMappingURL=itemControllers.js.map