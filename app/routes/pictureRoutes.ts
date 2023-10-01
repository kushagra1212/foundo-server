import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import itemPictureControllers from '../controllers/itemPictureControllers';

/* Get Item Pictures By Item Id | GET */
router.get('/item/:itemId', itemPictureControllers.getItemPicturesByItemId);

/* Add Item Pictures | POST */
router.post('/item', itemPictureControllers.addPictures);

export default router;
