"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const postControllers_1 = __importDefault(require("../controllers/postControllers"));
const auth_1 = require("../middleware/auth");
const constants_1 = require("../constants");
/* Get Matches By Item Id | GET */
router.get(constants_1.Routes.posts.getMatchesByItemId, auth_1.auth, postControllers_1.default.getMatchesByItemId);
/* Get Items By User Id | GET */
router.get(constants_1.Routes.posts.getItemsbyUserId, auth_1.auth, postControllers_1.default.getItemsbyUserId);
/* Get Items By Search String | GET */
router.get(constants_1.Routes.posts.getItemsBySearchString, postControllers_1.default.getItemsBySearchString);
/* Delete Item By Item Id | DELETE */
router.delete(constants_1.Routes.posts.deleteItemById, auth_1.auth, postControllers_1.default.deleteItemById);
/* Item By Item Id | GET */
router.get(constants_1.Routes.posts.getItemByItemId, postControllers_1.default.getItemByItemId);
/* Update Item By Item Id | PATCH */
router.patch(constants_1.Routes.posts.updateItemById, auth_1.auth, postControllers_1.default.updateItemById);
/* Get All Items | GET */
router.get(constants_1.Routes.posts.getItems, postControllers_1.default.getItems);
/* Add Item | POST */
router.post(constants_1.Routes.posts.addItem, auth_1.auth, postControllers_1.default.addItem);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map