const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/appAuthControllers');
const auth = require('../middleware/auth');

// GET  Forgot Password
router.get('/forgot-password/:email', authControllers.forgotPassword);
router.get(
  '/verify-reset-password-token/:email/:token',
  auth.verifyResetToken,
  authControllers.checkValidityofResetPasswordToken
);

router.get(
  '/verify-token/:token',
  auth.verifyToken,
  authControllers.checkValidityofResetPasswordToken
);
// POST Reset Password
router.post(
  '/reset-password/:email/:token',
  auth.verifyResetToken,
  authControllers.resetPassword
);

module.exports = router;
