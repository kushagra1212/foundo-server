const express = require('express');
const router = express.Router();
const itemPictureControllers = require('../controllers/itemPictureControllers');
const { auth } = require('../middleware/auth');
//GET PIctures of an item by item id
router.get('/', itemPictureControllers.getItemPictures);

//POST pictures
router.post('/add-picture', itemPictureControllers.addPictures);

// Update Item Picture Url
router.patch(
  '/update-picture-url',
  auth,
  itemPictureControllers.updateItemPictureUrl
);
module.exports = router;
