"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = __importDefault(require("../controllers/userControllers"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* User Signup */
router.post('/signup', userControllers_1.default.signupUser);
/* User Signin */
router.post('/signin', userControllers_1.default.signinUser);
/* Get All Users */
router.get('', userControllers_1.default.getAllUsers);
/* Get User By Id */
router.get('/:id', auth_1.auth, userControllers_1.default.getUserById);
/* Update User By Id */
router.patch('/:id', auth_1.auth, userControllers_1.default.updateUserById);
/* Delete User By Id */
router.delete('/:id', auth_1.auth, userControllers_1.default.deleteUserById);
/* Send OTP */
router.get('/send/otp/:id', auth_1.auth, userControllers_1.default.sendOtp);
/* Verify OTP */
router.get('/verify/otp/:id/:otp', auth_1.auth, userControllers_1.default.verifyOtp);
/* Reset OTP */
router.get('/reset/otp/:id', auth_1.auth, userControllers_1.default.resetOtp);
// delete request Delete by Id
router.delete('/', userControllers_1.default.deleteUserById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map