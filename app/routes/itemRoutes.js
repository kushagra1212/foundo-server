const express = require('express');
const router = express.Router();
const itemControllers = require('../controllers/itemControllers');
//POST ADD Lost Item
router.post('/addlost', itemControllers.addLostItem);
router.post('/addfound', itemControllers.addFoundedItem);

//DELETE Item By Item Id
router.delete('/deleteitem', itemControllers.deleteItemByItemId);

//GET Item Id
router.get('/:id', itemControllers.getItemByItemId);
module.exports = router;
