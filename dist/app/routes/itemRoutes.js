const express = require('express');
const router = express.Router();
const itemControllers = require('../controllers/itemControllers');
const { auth } = require('../middleware/auth');
//POST ADD Lost Item
router.post('/', auth, itemControllers.addItem);
//DELETE Item By Item Id
router.delete('/:itemId', auth, itemControllers.deleteItemByItemId);
//Update Item by item Id
router.patch('/update', auth, itemControllers.updateItemById);
//GET All Items
router.get('/all', itemControllers.getItems);
//GET ALL BY SEACH
router.get('/all-by-search', itemControllers.getItemsBySearchString);
//GET Item Id
router.get('/all-by-user', auth, itemControllers.getItemsbyUserId);
router.post('/posts', itemControllers.getMatchedPosts);
router.get('/:itemID/matches', itemControllers.getMatchesByItemId);
router.get('/:id', itemControllers.getItemByItemId);
module.exports = router;
//# sourceMappingURL=itemRoutes.js.map