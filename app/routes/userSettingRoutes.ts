import express from 'express';
const router = express.Router();
import userSettingControllers from '../controllers/userSettingControllers';
import { auth } from '../middleware/auth';
import { Routes } from '../constants';

/* Get user setting by User Id | Get */
router.get(Routes.userSettings.getUserSettingByUserId, auth, userSettingControllers.getUserSettingByUserId);

/* Update user setting by User Id | Patch */
router.patch(Routes.userSettings.updateUserSettingbyUserId, auth, userSettingControllers.updateUserSettingbyUserId);

export default router;