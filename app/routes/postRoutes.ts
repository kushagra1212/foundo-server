import express from 'express';
const router = express.Router();
import postControllers from '../controllers/postControllers';
import { auth } from '../middleware/auth';
import { Routes } from "../config/routes"

/* Get Matches By Item Id | GET */
router.get(Routes.posts.getMatchesByItemId, auth,postControllers.getMatchesByItemId);

/* Get Items By User Id | GET */
router.get(Routes.posts.getItemsbyUserId, auth, postControllers.getItemsbyUserId);

/* Get Items By Search String | GET */
router.get(Routes.posts.getItemsBySearchString, postControllers.getItemsBySearchString);

/* Delete Item By Item Id | DELETE */
router.delete(Routes.posts.deleteItemById, auth, postControllers.deleteItemById);

/* Item By Item Id | GET */
router.get(Routes.posts.getItemByItemId, postControllers.getItemByItemId);

/* Update Item By Item Id | PATCH */
router.patch(Routes.posts.updateItemById, auth, postControllers.updateItemById);

/* Get All Items | GET */
router.get(Routes.posts.getItems, postControllers.getItems);

/* Add Item | POST */
router.post(Routes.posts.addItem, auth, postControllers.addItem);


export default router;
