"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const itemPictureControllers_1 = __importDefault(require("../controllers/itemPictureControllers"));
/* Get Item Pictures By Item Id | GET */
router.get('/item/:itemId', itemPictureControllers_1.default.getItemPicturesByItemId);
/* Add Item Pictures | POST */
router.post('/item', itemPictureControllers_1.default.addPictures);
exports.default = router;
//# sourceMappingURL=pictureRoutes.js.map