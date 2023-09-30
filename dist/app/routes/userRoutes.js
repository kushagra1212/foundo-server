"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = __importDefault(require("../controllers/userControllers"));
const auth_1 = require("../middleware/auth");
const constants_1 = require("../constants");
const router = express_1.default.Router();
/* Send OTP */
router.get(constants_1.Routes.users.sendOtp, auth_1.auth, userControllers_1.default.sendOtp);
/* Reset OTP */
router.get(constants_1.Routes.users.resetOtp, auth_1.auth, userControllers_1.default.resetOtp);
/* Verify OTP */
router.get(constants_1.Routes.users.verifyOtp, auth_1.auth, userControllers_1.default.verifyOtp);
/* User Signup */
router.post(constants_1.Routes.users.signupUser, userControllers_1.default.signupUser);
/* User Signin */
router.post(constants_1.Routes.users.signinUser, userControllers_1.default.signinUser);
/* Get All Users */
router.get(constants_1.Routes.users.getAllUsers, auth_1.auth, userControllers_1.default.getAllUsers);
/* Get User By Id */
router.get(constants_1.Routes.users.getUserById, auth_1.auth, userControllers_1.default.getUserById);
/* Update User By Id */
router.patch(constants_1.Routes.users.updateUserById, auth_1.auth, userControllers_1.default.updateUserById);
/* Delete User By Id */
router.delete(constants_1.Routes.users.deleteUserById, auth_1.auth, userControllers_1.default.deleteUserById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map