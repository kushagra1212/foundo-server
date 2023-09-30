"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSetting_1 = __importDefault(require("../models/UserSetting"));
const logger_1 = __importDefault(require("../logger/logger"));
const customErrors_1 = require("../custom-errors/customErrors");
const getUserSettingByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        logger_1.default.error('userId is required');
        throw new customErrors_1.ValidationError('userId is required');
    }
    try {
        const [userSettingResult, __] = yield UserSetting_1.default.findUserSetting({
            fk_userId: Number(userId),
        });
        if (!userSettingResult || !userSettingResult.length) {
            logger_1.default.error(`user setting not found for userId ${userId}`);
            throw new customErrors_1.NotFoundError('user setting not found');
        }
        logger_1.default.info(`user Setting found for userId ${userId}`);
        res.status(200).send({ userSetting: userSettingResult[0], success: true });
    }
    catch (err) {
        logger_1.default.error(`user Setting update failed for userId ${userId}`);
        next(err);
    }
});
const updateUserSettingbyUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userSettingResult = yield UserSetting_1.default.updateUserSettingByUserId({
            userSetting: req.body,
            fk_userId: Number(userId),
        });
        logger_1.default.info(`user Setting updated for userId ${userId}`);
        return res
            .status(200)
            .send({ userSetting: userSettingResult, success: true });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
exports.default = {
    updateUserSettingbyUserId,
    getUserSettingByUserId,
};
//# sourceMappingURL=userSettingControllers.js.map