var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// utility.js
const Item = require('../models/Item');
const ItemLocation = require('../models/ItemLocation');
const ItemPicture = require('../models/ItemPicture');
const promisePool = require('../db');
const { S3Image } = require('../s3/S3image');
class ItemManager {
    constructor() {
        // You can add any constructor logic if needed
    }
    getItemDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                return {
                    error: 'error',
                    errorMessage: 'id is not provided',
                    success: false,
                    statusCode: 400,
                };
            }
            try {
                const [itemResult, __] = yield Item.findItem({ itemId: id });
                if (!itemResult || !itemResult.length) {
                    return {
                        error: 'not found',
                        errorMessage: 'item not found',
                        success: false,
                        statusCode: 404,
                    };
                }
                const [picturesResults, _] = yield ItemPicture.getPictures({
                    itemId: id,
                    limit: '3',
                    offset: '0',
                });
                const [locationResults, ___] = yield ItemLocation.getLocation({
                    itemId: id,
                });
                return {
                    item: Object.assign(Object.assign({}, itemResult[0]), { itemPictures: picturesResults, itemLocation: locationResults[0] }),
                    success: true,
                    statusCode: 200,
                };
            }
            catch (err) {
                return {
                    error: 'server error',
                    errorMessage: err.message,
                    success: false,
                    statusCode: 500,
                };
            }
        });
    }
    getAllItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, offset } = query;
            if (offset === undefined || limit === undefined) {
                return {
                    success: false,
                    errorMessage: 'offset and limit required',
                    statusCode: 400,
                };
            }
            try {
                const [itemResult, _] = yield Item.findItemsByUserIdorAll(query);
                if (!itemResult || !itemResult.length) {
                    return {
                        error: 'not found',
                        errorMessage: 'items not found',
                        success: false,
                        statusCode: 404,
                    };
                }
                return { items: itemResult, success: true, statusCode: 200 };
            }
            catch (err) {
                return {
                    error: 'server error',
                    errorMessage: err.message,
                    success: false,
                    statusCode: 500,
                };
            }
        });
    }
    addItem(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { itemName, color, dateTime, description, brand, city, category, userId, isFounded, pictures, location, college, } = body;
            const item = new Item({
                itemName,
                color,
                dateTime,
                description,
                brand,
                city,
                category,
                userId,
                isFounded,
                college,
            });
            if (!itemName ||
                !color ||
                !dateTime ||
                !description ||
                !brand ||
                !city ||
                !category ||
                !userId ||
                !pictures ||
                !location)
                return ({
                    error: 'Bad Request',
                    errorMessage: 'Please fill all the fields',
                    success: false,
                    statusCode: 400,
                });
            let connection;
            let result;
            try {
                connection = yield promisePool.getConnection();
                yield connection.beginTransaction();
                const [savedItem, _] = yield item.save();
                console.log(savedItem);
                const s3ImageObj = new S3Image();
                let picturesArray = [];
                for (let i = 0; i < pictures.length; i++) {
                    const pic = yield s3ImageObj.upload({
                        id: savedItem.insertId,
                        base64: pictures[i].image,
                        folderName: (isFounded ? 'foundItems' : 'lostItems'),
                    });
                    picturesArray.push({ image: pic });
                }
                const itemPicture = new ItemPicture({
                    pictures: picturesArray,
                    itemId: savedItem.insertId
                });
                yield itemPicture.save();
                const itemLocation = new ItemLocation({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    itemId: savedItem.insertId
                });
                yield itemLocation.save();
                yield Item.updateItem(savedItem.insertId, 'thumbnail', picturesArray[0].image);
                yield connection.commit();
                result = ({ itemId: savedItem.insertId, success: true, statusCode: 200 });
            }
            catch (err) {
                if (connection)
                    yield connection.rollback();
                result = ({ error: 'Bad Request', errorMessage: err.message, success: false, statusCode: 400 });
            }
            finally {
                if (connection)
                    connection.release();
            }
            return result;
        });
    }
}
module.exports = ItemManager;
//# sourceMappingURL=utility.js.map