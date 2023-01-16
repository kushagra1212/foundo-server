const express = require('express');
const router = express.Router();
const itemControllers = require('../controllers/itemControllers');
const { auth } = require('../middleware/auth');
//POST ADD Lost Item
router.post('/add-lost', auth, itemControllers.addLostItem);
router.post('/add-found', auth, itemControllers.addFoundedItem);

//DELETE Item By Item Id
router.delete('/deleteitem', auth, itemControllers.deleteItemByItemId);

//Update Item by item Id
router.patch('/update', auth, itemControllers.updateItemById);

//GET All Items
router.get('/all', itemControllers.getItems);
//GET ALL BY SEACH
router.get('/all-by-search', itemControllers.getItemsBySearchString);
//GET Item Id
router.get('/user/all', auth, itemControllers.getItemsbyUserId);
router.get('/:id', itemControllers.getItemByItemId);

module.exports = router;
