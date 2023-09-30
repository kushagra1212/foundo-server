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
const User_1 = __importDefault(require("../models/User"));
const salt = process.env.SALT;
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../logger/logger"));
const customErrors_1 = require("../custom-errors/customErrors");
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email) {
            logger_1.default.error(`email is not provided`);
            throw new customErrors_1.ValidationError('please provide email !');
        }
        const [user, _] = yield User_1.default.findUserByEmail({ userEmail: email });
        if (!user || !user.length) {
            logger_1.default.error(`email is not found`);
            throw new customErrors_1.NotFoundError('please check your email address again !');
        }
        const maxAgeOfJWTToken = 60 * 60 * 24 * 6; // Validity 6 Hour Only
        /* Taking old password as a secret [dynamic]
           Will be Validating while taking NewPassword
        */
        const _user = user[0];
        const jwtSecret = _user.password;
        const token = (0, utils_1.createToken)({
            id: user[0].id,
            jwtSecret,
            maxAgeOfToken: maxAgeOfJWTToken,
        });
        const sender = {
            email: 'foundoapplication@gmail.com',
            name: 'Foundo App',
        };
        const receivers = [
            {
                name: user[0].name,
                email: email,
            },
        ];
        let resetPasswordLink = `${process.env.RESET_PASS_APP_URL}`;
        yield (0, utils_1.sendTransactionalEmail)({
            sender,
            to: receivers,
            subject: 'Foundo! Reset Your Password',
            textContent: `Reset Password Link`,
            htmlContent: `
          <h1>Foundo Application</h1>
          <h3>Here is your reset password Link</h3>
          <a href="${resetPasswordLink}/${email}/${token}">Reset Password</a>`,
        });
        logger_1.default.info(`email sent successfully`);
        res.status(200).send({ message: 'Email sent successfully', success: true });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const checkValidityofToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info(`Token verified.`);
        return res
            .status(200)
            .send(Object.assign(Object.assign({}, req.decoded), { user: req.user[0], success: true }));
    }
    catch (err) {
        logger_1.default.error(err.message);
        next(err);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password } = req.body;
        if (!password) {
            logger_1.default.error(`password is not provided`);
            throw new customErrors_1.ValidationError('please provide password !');
        }
        let hashedPassword = yield bcrypt_1.default.hash(password, parseInt(salt));
        const [user, _] = yield User_1.default.changePassword({
            email: (_a = req === null || req === void 0 ? void 0 : req.user[0]) === null || _a === void 0 ? void 0 : _a.email,
            password: hashedPassword,
        });
        logger_1.default.info(`Password Changed Successfully for userId: ${user === null || user === void 0 ? void 0 : user.id}`);
        res.send({
            user,
            message: 'Password Changed Successfully !',
            success: true,
        });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
exports.default = {
    forgotPassword,
    checkValidityofToken,
    resetPassword,
};
//# sourceMappingURL=appAuthControllers.js.map