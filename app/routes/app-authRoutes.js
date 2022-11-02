const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/appAuthControllers');
const auth = require('../middleware/auth');

// GET  Forgot Password
router.get('/forgot-password/:email', authControllers.forgotPassword);
router.get(
  '/verify-token/:email/:token',
  auth.verifyToken,
  authControllers.checkValidityofToken
);

// POST Reset Password
router.post(
  '/reset-password/:email/:token',
  auth.verifyToken,
  authControllers.resetPassword
);

module.exports = router;
