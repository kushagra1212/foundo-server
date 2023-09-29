import express from 'express';
import userControllers from '../controllers/userControllers';
import {auth} from '../middleware/auth';
import { Routes } from '../constants';

const router = express.Router();

/* Send OTP */
router.get(Routes.users.sendOtp, auth, userControllers.sendOtp);

/* Reset OTP */
router.get(Routes.users.resetOtp, auth, userControllers.resetOtp);

/* Verify OTP */
router.get(Routes.users.verifyOtp, auth, userControllers.verifyOtp);

/* User Signup */
router.post(Routes.users.signupUser, userControllers.signupUser);

/* User Signin */
router.post(Routes.users.signinUser, userControllers.signinUser);

/* Get All Users */
router.get(Routes.users.getAllUsers, auth, userControllers.getAllUsers);

/* Get User By Id */
router.get(Routes.users.getUserById, auth, userControllers.getUserById);

/* Update User By Id */
router.patch(Routes.users.updateUserById, auth, userControllers.updateUserById);

/* Delete User By Id */
router.delete(
  Routes.users.deleteUserById,
  auth,
  userControllers.deleteUserById,
);

export default router;
