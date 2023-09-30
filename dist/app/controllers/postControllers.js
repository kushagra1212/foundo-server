"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const utility_1 = __importDefault(require("./utility"));
const matchingLogic_1 = __importDefault(require("../ai/matchingLogic"));
const logger_1 = __importDefault(require("../logger/logger"));
const Item_1 = __importDefault(require("../models/Item"));
const customErrors_1 = require("../custom-errors/customErrors");
const itemMatcher = new matchingLogic_1.default();
const getItemByItemId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield utility_1.default.getItemDetails(id);
        return res.status(200).send(result);
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const addItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield utility_1.default.addItem(req.body);
        return res.status(201).send(result);
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const deleteItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield connection.beginTransaction();
        yield Item_1.default.deleteItem({ id });
        yield connection.commit();
        res
            .status(200)
            .send({ id, message: 'deleted successfully', success: true });
    }
    catch (err) {
        if (connection)
            yield connection.rollback();
        logger_1.default.error(err);
        next(err);
    }
    finally {
        if (connection)
            connection.release();
    }
});
const updateItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: itemId } = req.params;
        const { description } = req.body;
        if (!itemId) {
            throw new customErrors_1.ValidationError('itemId is required');
        }
        if (description === undefined) {
            throw new customErrors_1.ValidationError('description is required');
        }
        yield Item_1.default.updateItem(Number(itemId), 'description', description);
        res
            .status(200)
            .send({ success: true, mesage: 'item updated Successfully' });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const getItemsbyUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new customErrors_1.ValidationError('userId is required');
        }
        req.query.userId = userId;
        const result = yield utility_1.default.getAllItems(req.query);
        return res.status(200).send(result);
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield utility_1.default.getAllItems(req.query);
        return res.status(200).send(result);
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const getItemsBySearchString = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, offset, searchstring } = req.query;
    try {
        if (!offset || !limit || !searchstring) {
            throw new customErrors_1.ValidationError('offset, limit and searchstring are required');
        }
        const [[finalResult], [count]] = yield Item_1.default.findItemBySearchStringRegExp({
            searchString: String(searchstring),
            offset: Number(offset),
            limit: Number(limit),
        });
        if (!finalResult || !finalResult.length) {
            throw new customErrors_1.NotFoundError('No items found');
        }
        res
            .status(200)
            .send({ total: count[0].total, items: finalResult, success: true });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const getMatchesByItemId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const result = yield utility_1.default.getItemDetails(itemId);
        const { description } = result.item;
        const { items } = yield utility_1.default.getAllItems({
            offset: '0',
            limit: '100',
        });
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
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
exports.default = {
    getItemByItemId,
    addItem,
    deleteItemById,
    updateItemById,
    getItemsbyUserId,
    getItems,
    getItemsBySearchString,
    getMatchesByItemId,
};
//# sourceMappingURL=postControllers.js.map