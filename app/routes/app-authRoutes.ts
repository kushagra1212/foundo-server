import express from 'express';
import authControllers from '../controllers/appAuthControllers';
import auth from '../middleware/auth';
import { Routes } from '../config/routes';

const router = express.Router();
/* Forgot Password  | GET */
router.get(Routes.appAuth.forgotPassword, authControllers.forgotPassword);


/* Verify Reset Password Token | GET */
router.get(
  Routes.appAuth.verifyResetPasswordToken,
  auth.verifyResetToken,
  authControllers.checkValidityofToken
);


/* Verify Token | GET */
router.get(
  Routes.appAuth.verifyToken,
  auth.verifyToken,
  authControllers.checkValidityofToken
);

/* Reset Password | POST */
router.post(
  Routes.appAuth.resetPassword,
  auth.verifyResetToken,
  authControllers.resetPassword
);

export default router;