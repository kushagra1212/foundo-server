const express = require('express');
const router = express.Router();
const userSettingControllers = require('../controllers/userSettingControllers');

//GET user setting by User Id

router.get('/:userId', userSettingControllers.getUserSettingByUserId);

//PATCH Update User Setting

router.patch('/update', userSettingControllers.updateUserSettingbyUserId);

module.exports = router;
