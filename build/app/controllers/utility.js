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
const customErrors_1 = require("../custom-errors/customErrors");
// utility.js
const ItemPicture_1 = __importDefault(require("../models/ItemPicture"));
const db_1 = __importDefault(require("../db"));
const S3image_1 = __importDefault(require("../s3/S3image"));
const ItemLocation_1 = __importDefault(require("../models/ItemLocation"));
const Location_1 = __importDefault(require("../models/Location"));
const Item_1 = __importDefault(require("../models/Item"));
const logger_1 = __importDefault(require("../logger/logger"));
class ItemManager {
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!id) {
                        throw new customErrors_1.ValidationError('id is required');
                    }
                    const [itemResult, __] = yield Item_1.default.findItem({ itemId: id });
                    if (!itemResult || !itemResult.length) {
                        throw new customErrors_1.NotFoundError('item not found');
                    }
                    const [picturesResults, _] = yield ItemPicture_1.default.getPictures({
                        fk_itemId: id,
                        limit: '3',
                        offset: '0',
                    });
                    const [locationResults, ___] = yield ItemLocation_1.default.getCompleteLocationByItemId({
                        fk_itemId: id,
                    });
                    resolve({
                        item: Object.assign(Object.assign({}, itemResult[0]), { itemPictures: picturesResults, itemLocation: locationResults[0] }),
                        success: true,
                    });
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    getAllItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { limit, offset } = query;
                    if (offset === undefined || limit === undefined) {
                        throw new customErrors_1.ValidationError('offset and limit are required');
                    }
                    const [itemResult, _] = yield Item_1.default.findItemsByUserIdorAll(query);
                    if (!itemResult || !itemResult.length) {
                        throw new customErrors_1.NotFoundError('item not found');
                    }
                    resolve({
                        items: itemResult,
                        success: true,
                    });
                }
                catch (err) {
                    reject(err);
                }
            }));
        });
    }
    addItem(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let connection;
                try {
                    const { itemName, color, dateTime, description, brand, city, category, fk_userId, isFounded, pictures, location, } = body;
                    const item = new Item_1.default({
                        itemName,
                        color,
                        dateTime,
                        description,
                        brand,
                        city,
                        category,
                        fk_userId,
                        isFounded,
                    });
                    if (!itemName ||
                        !color ||
                        !dateTime ||
                        !description ||
                        !brand ||
                        !city ||
                        !category ||
                        !fk_userId ||
                        !pictures ||
                        !location) {
                        throw new customErrors_1.ValidationError('All fields are required');
                    }
                    connection = yield db_1.default.getConnection();
                    yield connection.beginTransaction();
                    logger_1.default.info('connection started');
                    // Save item
                    const [savedItem, _] = yield item.save();
                    const s3ImageObj = new S3image_1.default();
                    // Save pictures
                    let picturesArray = [];
                    for (let i = 0; i < pictures.length; i++) {
                        const pic = yield s3ImageObj.upload({
                            id: savedItem.insertId,
                            base64: pictures[i].image,
                            folderName: isFounded ? 'foundItems' : 'lostItems',
                        });
                        picturesArray.push({ image: pic });
                    }
                    const itemPicture = new ItemPicture_1.default({
                        pictures: picturesArray,
                        fk_itemId: savedItem.insertId,
                    });
                    yield itemPicture.save();
                    // Save location
                    const createLocation = new Location_1.default({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    });
                    const [savedLocation, __] = yield createLocation.save();
                    // Save item location
                    const itemLocation = new ItemLocation_1.default({
                        fk_itemId: savedItem.insertId,
                        fk_locationId: savedLocation.insertId,
                    });
                    yield itemLocation.save();
                    // Update item with thumbnail
                    yield Item_1.default.updateItem(savedItem.insertId, 'thumbnail', picturesArray[0].image);
                    yield connection.commit();
                    logger_1.default.info('connection commited');
                    resolve({
                        success: true,
                        message: 'item added successfully',
                        itemId: savedItem.insertId,
                    });
                }
                catch (err) {
                    if (connection) {
                        yield connection.rollback();
                        logger_1.default.info('connection rolled back');
                    }
                    reject(err);
                }
                finally {
                    if (connection) {
                        logger_1.default.info('connection released');
                        connection.release();
                    }
                }
            }));
        });
    }
}
exports.default = new ItemManager();
//# sourceMappingURL=utility.js.map