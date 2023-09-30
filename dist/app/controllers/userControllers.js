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
const UserSetting_1 = __importDefault(require("../models/UserSetting"));
const db_1 = __importDefault(require("../db"));
const salt = process.env.SALT;
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../utils/index");
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const S3image_1 = __importDefault(require("../s3/S3image"));
const logger_1 = __importDefault(require("../logger/logger"));
const customErrors_1 = require("../custom-errors/customErrors");
//create user | POST
const signupUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    let connection;
    try {
        if (!firstName || !lastName || !email || !password) {
            throw new customErrors_1.ValidationError('firstName, lastName, email and password are required');
        }
        let hashedPassword = yield bcrypt_1.default.hash(password, parseInt(salt));
        connection = yield db_1.default.getConnection();
        connection.beginTransaction();
        const user = new User_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const [result, _] = yield user.save();
        const userSetting = new UserSetting_1.default({
            fk_userId: result.insertId,
        });
        yield userSetting.save();
        connection.commit();
        logger_1.default.info(`User ${result.insertId} created`);
        res.status(201).send({
            user: Object.assign(Object.assign({}, user), { userId: result.insertId, password: '' }),
            message: 'Account Created !',
            success: true,
        });
    }
    catch (err) {
        if (connection)
            connection.rollback();
        if (err.errno === 1062) {
            err.message = 'This Email is already in use !';
        }
        logger_1.default.error(err.message);
        next(err);
    }
    finally {
        if (connection)
            connection.release();
    }
});
//SignIn user
const signinUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            logger_1.default.error(`email and password are required`);
            throw new customErrors_1.ValidationError('email and password are required');
        }
        const [user, _] = yield User_1.default.findUserByEmail({ userEmail: email });
        if (!user || !user.length) {
            logger_1.default.error(`User with email ${email} not found`);
            throw new customErrors_1.BadRequestError('User not found');
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user[0].password);
        if (!isPasswordCorrect) {
            logger_1.default.error(`User ${user[0].id} entered wrong password`);
            throw new customErrors_1.BadRequestError('password is incorrect');
        }
        const token = (0, index_1.createToken)({
            id: user[0].id,
            jwtSecret,
            maxAgeOfToken,
        });
        logger_1.default.info(`User ${user[0].id} logged in`);
        res.status(200).send({
            jwtToken: token,
            message: 'successfully loggedin',
            user: Object.assign(Object.assign({}, user[0]), { password: '' }),
            success: true,
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        next(err);
    }
});
//delete User based on userId | POST
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        logger_1.default.error(`id is required`);
        throw new customErrors_1.BadRequestError('userId is required');
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            throw new customErrors_1.NotFoundError('user not found');
        }
        const [result, _] = yield User_1.default.deleteUser({ userId: Number(id) });
        if (result.affectedRows) {
            logger_1.default.info(`user ${id} deleted`);
            return res.status(200).send({ user: userResult[0], success: true });
        }
        logger_1.default.error(`user ${id} is not deleted`);
        throw new customErrors_1.UnprocessableEntityError('user is not deleted');
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
// get user by user id | GET
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reqJwt = req;
    const userIdWhoMadeReq = reqJwt.jwt.id;
    if (!id) {
        logger_1.default.error(`userId is required`);
        throw new customErrors_1.ValidationError('userId is required');
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        const [userSettingResult, ___] = yield UserSetting_1.default.findUserSetting({
            fk_userId: Number(id),
        });
        const userSetting = userSettingResult[0];
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            throw new customErrors_1.NotFoundError('user not found');
        }
        let user = userResult[0];
        if (Number(userIdWhoMadeReq) !== user.id) {
            if (!userSetting.displayPhoneNo)
                user = Object.assign(Object.assign({}, user), { phoneNo: null });
            if (!userSetting.displayAddress)
                user = Object.assign(Object.assign({}, user), { address: null });
            if (!userSetting.displayProfilePhoto)
                user = Object.assign(Object.assign({}, user), { profilePhoto: null });
        }
        logger_1.default.info(`user ${id} found`);
        res.status(200).send({ user, success: true });
    }
    catch (err) {
        next(err);
    }
});
// Update User by Id
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    const newProfilePhoto = req.body.profilePhoto;
    const newAddress = req.body.address;
    const newPhoneNo = req.body.phoneNo;
    const newCountryCode = req.body.countryCode;
    if (!userId) {
        logger_1.default.error(`userId is required`);
        throw new customErrors_1.ValidationError('userId is required');
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(userId) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${userId}`);
            throw new customErrors_1.NotFoundError('user not found');
        }
        let user = userResult[0];
        if (newPhoneNo && user.phoneNo !== newPhoneNo)
            user.phoneNo = newPhoneNo;
        if (newCountryCode && user.countryCode !== newCountryCode)
            user.countryCode = newCountryCode;
        if (newProfilePhoto) {
            const s3ImageObj = new S3image_1.default();
            yield s3ImageObj.delete(user.profilePhoto);
            const location = yield s3ImageObj.upload({
                id: userId,
                base64: newProfilePhoto,
                folderName: 'profilePhoto',
            });
            user.profilePhoto = location;
        }
        if (newAddress && user.address !== newAddress)
            user.address = newAddress;
        try {
            user = Object.assign(Object.assign({}, user), { phoneNo: user.phoneNo, countryCode: user.countryCode, profilePhoto: user.profilePhoto, address: user.address });
            yield User_1.default.updateUser({
                user,
                id: user.id,
            });
            logger_1.default.info(`user ${userId} updated`);
            res.status(200).send({ user, success: true });
            return;
        }
        catch (err) {
            logger_1.default.error(err.message);
            throw new customErrors_1.UpdateError('user is not updated');
        }
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, offset } = req.params;
    logger_1.default.info(`limit: ${limit}, offset: ${offset}`);
    try {
        if (!limit || !offset) {
            logger_1.default.error(`limit and offset are required`);
            throw new customErrors_1.ValidationError('limit and offset are required');
        }
        const [allUsers, __] = yield User_1.default.findAllUsers({
            limit: limit.toLocaleString(),
            offset: offset.toString(),
        });
        if (!allUsers || !allUsers.length) {
            logger_1.default.error(`no users found`);
            throw new customErrors_1.NotFoundError('no users found');
        }
        logger_1.default.info(`users found`);
        res.status(200).send({ allUsers: allUsers, success: true });
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            logger_1.default.error('user id is required');
            throw new customErrors_1.ValidationError('user id is required');
        }
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            throw new customErrors_1.NotFoundError('user not found');
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const [result, _] = yield User_1.default.updateUser({
            user: Object.assign(Object.assign({}, userResult[0]), { otp }),
            id: Number(id),
        });
        if (result === null || result === void 0 ? void 0 : result.affectedRows) {
            const message = `Your OTP for Email Verification is ${otp}`;
            const sender = {
                email: 'foundoapplication@gmail.com',
                name: 'Foundo App',
            };
            const receivers = [
                {
                    name: userResult[0].firstName + ' ' + userResult[0].lastName,
                    email: userResult[0].email,
                },
            ];
            yield (0, index_1.sendTransactionalEmail)({
                sender,
                to: receivers,
                subject: 'Verification OTP',
                textContent: `Verify your email by entering this OTP ${otp}`,
                htmlContent: `
          <h1>Foundo Application</h1>
          <h3>${message}</h3>`,
            });
            logger_1.default.info(`OTP sent to ${userResult[0].email}`);
            return res.status(200).send({ success: true, message: 'OTP sent' });
        }
        logger_1.default.error(`OTP sending failed for user ${id}`);
        throw new customErrors_1.UpdateError('OTP sending failed');
    }
    catch (err) {
        logger_1.default.error(err);
        next(err);
    }
});
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, otp } = req.params;
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            throw new customErrors_1.ValidationError('user not found');
        }
        if (userResult[0].otp === Number(otp) && Number(otp) !== 0) {
            const [result, _] = yield User_1.default.updateUser({
                user: Object.assign(Object.assign({}, userResult[0]), { otp: 0, is_verified: 1 }),
                id: Number(id),
            });
            if (result === null || result === void 0 ? void 0 : result.affectedRows) {
                logger_1.default.info(`Email of user ${id} verified`);
                return res.status(200).send({
                    user: Object.assign(Object.assign({}, userResult[0]), { otp: 0, is_verified: 1 }),
                    success: true,
                    message: 'Your Email has been Verified Successfully !',
                });
            }
        }
        logger_1.default.error(`OTP didn't match for user ${id}`);
        throw new customErrors_1.NotFoundError('OTP did not match');
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const resetOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            throw new customErrors_1.ValidationError('user not found');
        }
        const [result, _] = yield User_1.default.updateUser({
            user: Object.assign(Object.assign({}, userResult[0]), { otp: 0 }),
            id: Number(id),
        });
        if (result === null || result === void 0 ? void 0 : result.affectedRows) {
            logger_1.default.info(`OTP reset for user ${id}`);
            return res.status(200).send({ success: true, message: 'OTP reset' });
        }
        logger_1.default.error(`OTP reset failed for user ${id}`);
        throw new customErrors_1.UpdateError('OTP reset failed');
    }
    catch (err) {
        logger_1.default.error(err);
        next();
    }
});
exports.default = {
    signupUser,
    signinUser,
    deleteUserById,
    getUserById,
    updateUserById,
    getAllUsers,
    sendOtp,
    verifyOtp,
    resetOtp,
};
//# sourceMappingURL=userControllers.js.map