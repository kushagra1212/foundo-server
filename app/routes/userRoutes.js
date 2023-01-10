const express = require('express');
const userControllers = require('../controllers/userControllers');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST  SignUp user
router.post('/signup', userControllers.signupUser);
// POST signIn and get Token
router.post('/signin', userControllers.signinUser);

// GET ALL Users
router.get('/all', userControllers.getAllUsers);

// GET user By Id
router.get('/:id', userControllers.getUserById);

//PATCH update user
router.patch('/update', auth, userControllers.updateUserbyId);
router.get('/send-otp/:id', auth, userControllers.sendOtp);
router.get('/verify-otp/:id/:otp', auth, userControllers.verifyOtp);
router.get('/reset-otp/:id', auth, userControllers.resetOtp);
// delete request Delete by Id
router.delete('/', userControllers.deleteUserById);
module.exports = router;
