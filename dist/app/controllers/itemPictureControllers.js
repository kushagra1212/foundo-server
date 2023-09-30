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
const Item_1 = __importDefault(require("../models/Item"));
const ItemPicture_1 = __importDefault(require("../models/ItemPicture"));
const customErrors_1 = require("../custom-errors/customErrors");
const logger_1 = __importDefault(require("../logger/logger"));
const getItemPicturesByItemId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const { limit, offset } = req.query;
        if (!limit || !offset || !itemId) {
            throw new customErrors_1.ValidationError('limit, offset, itemId are required');
        }
        const [picturesResult, _] = yield ItemPicture_1.default.getPictures({
            limit,
            offset,
            fk_itemId: itemId,
        });
        if (!(picturesResult === null || picturesResult === void 0 ? void 0 : picturesResult.length)) {
            throw new customErrors_1.NotFoundError('pictures not found');
        }
        res.status(200).send({ pictures: picturesResult, success: true });
    }
    catch (err) {
        logger_1.default.error(err.message);
        next(err);
    }
});
const addPictures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, pictures } = req.body;
        if (!itemId) {
            throw new customErrors_1.ValidationError('itemId is required');
        }
        const [itemResult, __] = yield Item_1.default.findItem({ itemId });
        if (!itemResult || !itemResult.length) {
            throw new customErrors_1.NotFoundError('item not found');
        }
        const itemPictures = new ItemPicture_1.default({
            pictures,
            fk_itemId: itemId,
        });
        yield itemPictures.save();
        res
            .status(200)
            .send({ success: true, message: 'pictures added successfully' });
    }
    catch (err) {
        logger_1.default.error(err.message);
        next(err);
    }
});
exports.default = {
    getItemPicturesByItemId,
    addPictures,
};
//# sourceMappingURL=itemPictureControllers.js.map