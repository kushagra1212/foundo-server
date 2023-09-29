import express from 'express';
import authControllers from '../controllers/appAuthControllers';
import auth from '../middleware/auth';

const router = express.Router();
/* Forgot Password  | GET */
router.get('/forgot-password/:email', authControllers.forgotPassword);


/* Verify Reset Password Token | GET */
router.get(
  '/verify-reset-password-token/:email/:token',
  auth.verifyResetToken,
  authControllers.checkValidityofToken
);


/* Verify Token | GET */
router.get(
  '/verify-token/:token',
  auth.verifyToken,
  authControllers.checkValidityofToken
);

/* Reset Password | POST */
router.post(
  '/reset-password/:email/:token',
  auth.verifyResetToken,
  authControllers.resetPassword
);

export default router;