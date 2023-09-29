const express = require('express');
const router = express.Router();
const userSettingControllers = require('../controllers/userSettingControllers');
const { auth } = require('../middleware/auth');
//GET user setting by User Id
router.get('/:userId', auth, userSettingControllers.getUserSettingByUserId);
//PATCH Update User Setting
router.patch('/update', auth, userSettingControllers.updateUserSettingbyUserId);
module.exports = router;
//# sourceMappingURL=userSettingRoutes.js.map