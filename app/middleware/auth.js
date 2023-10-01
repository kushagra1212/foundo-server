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
exports.auth = void 0;
const jwtSecret = process.env.JWT_SECRET;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../logger/logger"));
const customErrors_1 = require("../custom-errors/customErrors");
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        logger_1.default.error('Access denied. No token provided.');
        throw new customErrors_1.UnauthorizedError('Access denied. No token provided.');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req['jwt'] = decoded;
        logger_1.default.info('Token verified.');
        next();
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
};
exports.auth = auth;
const verifyResetToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token } = req.params;
        const [user, _] = yield User_1.default.findUserByEmail({ userEmail: email });
        if (!user || !user.length) {
            logger_1.default.error('Please check your email again !');
            throw new customErrors_1.ValidationError('Please check your email again !');
        }
        const decoded = (0, utils_1.verifyToken)({
            jwtSecret: user[0].password,
            jwtToken: token,
        });
        req['user'] = user;
        req['decoded'] = decoded;
        logger_1.default.info('Token verified.');
        next();
    }
    catch (err) {
        logger_1.default.error(err);
        res.status(500).send({
            error: 'server error',
            errorMessage: 'Reset password link is invalid or has expired. Please try again !',
            success: false,
        });
    }
});
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const decoded = (0, utils_1.verifyToken)({
            jwtSecret: jwtSecret,
            jwtToken: token,
        });
        const [user, _] = yield User_1.default.findUser({ id: decoded.id });
        if (!user || !user.length) {
            logger_1.default.error('Please check your email again !');
            throw new customErrors_1.ValidationError('Please check your email again !');
        }
        req['user'] = user;
        req['decoded'] = decoded;
        logger_1.default.info('Token verified.');
        next();
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
exports.default = {
    auth: exports.auth,
    verifyResetToken,
    verifyToken,
};
//# sourceMappingURL=auth.js.map