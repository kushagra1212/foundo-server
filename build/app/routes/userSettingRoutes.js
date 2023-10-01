"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userSettingControllers_1 = __importDefault(require("../controllers/userSettingControllers"));
const auth_1 = require("../middleware/auth");
const constants_1 = require("../constants");
/* Get user setting by User Id | Get */
router.get(constants_1.Routes.userSettings.getUserSettingByUserId, auth_1.auth, userSettingControllers_1.default.getUserSettingByUserId);
/* Update user setting by User Id | Patch */
router.patch(constants_1.Routes.userSettings.updateUserSettingbyUserId, auth_1.auth, userSettingControllers_1.default.updateUserSettingbyUserId);
exports.default = router;
//# sourceMappingURL=userSettingRoutes.js.map