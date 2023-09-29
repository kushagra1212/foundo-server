import express from 'express';
import userControllers from '../controllers/userControllers';
import { auth } from '../middleware/auth';

const router = express.Router();

/* Send OTP */
router.get('/send/otp/:id', auth, userControllers.sendOtp);

/* Reset OTP */
router.get('/reset/otp/:id', auth, userControllers.resetOtp);

/* Verify OTP */
router.get('/verify/otp/:id/:otp', auth, userControllers.verifyOtp);

/* User Signup */
router.post('/signup', userControllers.signupUser);

/* User Signin */
router.post('/signin', userControllers.signinUser);

/* Get All Users */
router.get('/:limit/:offset', auth, userControllers.getAllUsers);

/* Get User By Id */
router.get('/:id', auth, userControllers.getUserById);

/* Update User By Id */
router.patch('/:id', auth, userControllers.updateUserById);

/* Delete User By Id */
router.delete('/:id', auth, userControllers.deleteUserById);

// delete request Delete by Id
router.delete('/', userControllers.deleteUserById);

export default router;
