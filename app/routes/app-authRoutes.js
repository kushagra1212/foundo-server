"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appAuthControllers_1 = __importDefault(require("../controllers/appAuthControllers"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
/* Forgot Password  | GET */
router.get('/forgot-password/:email', appAuthControllers_1.default.forgotPassword);
/* Verify Reset Password Token | GET */
router.get('/verify-reset-password-token/:email/:token', auth_1.default.verifyResetToken, appAuthControllers_1.default.checkValidityofToken);
/* Verify Token | GET */
router.get('/verify-token/:token', auth_1.default.verifyToken, appAuthControllers_1.default.checkValidityofToken);
/* Reset Password | POST */
router.post('/reset-password/:email/:token', auth_1.default.verifyResetToken, appAuthControllers_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=app-authRoutes.js.map