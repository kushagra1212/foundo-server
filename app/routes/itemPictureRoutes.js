const express = require('express');
const router = express.Router();
const itemPictureControllers = require('../controllers/itemPictureControllers');
//GET PIctures of an item by item id
router.get('/', itemPictureControllers.getItemPictures);

//POST pictures
router.post('/add-picture', itemPictureControllers.addPictures);
module.exports = router;
