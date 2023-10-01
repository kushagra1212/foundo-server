import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import itemPictureControllers from '../controllers/itemPictureControllers';
import { Routes } from '../config/routes';

/* Get Item Pictures By Item Id | GET */
router.get(Routes.pictures.getItemPicturesByItemId, itemPictureControllers.getItemPicturesByItemId);

/* Add Item Pictures | POST */
router.post(Routes.pictures.addPictures, itemPictureControllers.addPictures);

export default router;
