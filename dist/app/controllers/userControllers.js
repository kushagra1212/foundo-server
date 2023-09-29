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
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const index_1 = __importDefault(require("../utils/index"));
const { imageUpload, S3Image } = require('../s3/S3image');
const Sib = require('sib-api-v3-sdk');
const logger_1 = __importDefault(require("../logger/logger"));
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
//create user | POST
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    let connection;
    try {
        if (!firstName || !lastName || !email || !password) {
            res.status(400).send({
                error: 'Bad Request',
                errorMessage: 'firstName, lastName, email and password are required',
            });
            return;
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
        });
    }
    catch (err) {
        if (connection)
            connection.rollback();
        let errorMessage = err.message;
        if (err.errno === 1062) {
            errorMessage = 'This Email is already in use !';
        }
        logger_1.default.error(errorMessage);
        res.status(400).send({ error: 'Bad Request', errorMessage: errorMessage });
    }
    finally {
        if (connection)
            connection.release();
    }
});
//SignIn user
const signinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            logger_1.default.error(`email and password are required`);
            res.status(400).send({
                error: 'Bad Request',
                errorMessage: 'email and password are required',
            });
            return;
        }
        const [user, _] = yield User_1.default.findUserByEmail({ userEmail: email });
        if (!user || !user.length) {
            logger_1.default.error(`User with email ${email} not found`);
            res.status(400).send({
                error: 'Bad Request',
                errorMessage: 'Please check your email again !',
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user[0].password);
        if (!isPasswordCorrect) {
            logger_1.default.error(`User ${user[0].id} entered wrong password`);
            res
                .status(400)
                .send({ error: 'Bad Request', errorMessage: 'password is incorrect' });
            return;
        }
        const token = index_1.default.createToken({
            id: user[0].id,
            jwtSecret,
            maxAgeOfToken,
        });
        logger_1.default.info(`User ${user[0].id} logged in`);
        res.status(200).send({
            jwtToken: token,
            message: 'successfully loggedin',
            user: Object.assign(Object.assign({}, user[0]), { password: '' }),
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({
            error: 'server error',
            errorMessage: err.message,
            success: false,
        });
    }
});
//delete User based on userId | POST
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        logger_1.default.error(`userId is required`);
        res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'userId is required' });
        return;
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: userId });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${userId}`);
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
            return;
        }
        const [result, _] = yield User_1.default.deleteUser({ userId });
        if (result.affectedRows) {
            logger_1.default.info(`user ${userId} deleted`);
            res.status(200).send({ user: userResult[0], success: true });
        }
        else {
            logger_1.default.error(`user ${userId} is not deleted`);
            res
                .status(400)
                .send({ error: 'Bad Request', errorMessage: 'user is not deleted' });
        }
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
// get user by user id | GET
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reqJwt = req;
    const userIdWhoMadeReq = reqJwt.jwt.id;
    if (!id) {
        logger_1.default.error(`userId is required`);
        res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'fk_userId is required' });
        return;
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        const [userSettingResult, ___] = yield UserSetting_1.default.findUserSetting({
            fk_userId: Number(id),
        });
        const userSetting = userSettingResult[0];
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
            return;
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
        res.status(200).send({ user });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
// Update User by Id
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    const newProfilePhoto = req.body.profilePhoto;
    const newAddress = req.body.address;
    const newPhoneNo = req.body.phoneNo;
    const newCountryCode = req.body.countryCode;
    if (!userId) {
        logger_1.default.error(`userId is required`);
        res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'userId is required' });
        return;
    }
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(userId) });
        if (!userResult || !userResult.length) {
            return res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
        }
        let user = userResult[0];
        if (newPhoneNo && user.phoneNo !== newPhoneNo)
            user.phoneNo = newPhoneNo;
        if (newCountryCode && user.countryCode !== newCountryCode)
            user.countryCode = newCountryCode;
        if (newProfilePhoto) {
            const s3ImageObj = new S3Image();
            try {
                yield s3ImageObj.delete(user.profilePhoto);
                const location = yield s3ImageObj.upload({
                    id: userId,
                    base64: newProfilePhoto,
                    folderName: 'profilePhoto',
                });
                user.profilePhoto = location;
            }
            catch (err) {
                logger_1.default.error(err.message);
                return res.status(500).send({
                    error: 'server error',
                    errorMessage: err.message,
                });
            }
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
            res.status(200).send({ user });
            return;
        }
        catch (err) {
            logger_1.default.error(err.message);
            res
                .status(400)
                .send({ error: 'Bad Request', errorMessage: 'user update failed ' });
            return;
        }
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, offset } = req.query;
    try {
        if (!limit || !offset) {
            throw new Error('limit and offset are required');
        }
        const [allUsers, __] = yield User_1.default.findAllUsers({
            limit: Number(limit),
            offset: Number(offset),
        });
        if (!allUsers || !allUsers.length) {
            logger_1.default.error(`no users found`);
            return res
                .status(404)
                .send({ error: 'not found', errorMessage: 'no users' });
        }
        logger_1.default.info(`users found`);
        res.status(200).send({ allUsers: allUsers });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            logger_1.default.error('user id is required');
            res
                .status(400)
                .send({ error: 'Bad Request', errorMessage: 'user id is required' });
            return;
        }
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            return res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const [result, _] = yield User_1.default.updateUser({
            user: Object.assign(Object.assign({}, userResult[0]), { otp }),
            id: Number(id),
        });
        if (result === null || result === void 0 ? void 0 : result.affectedRows) {
            const message = `Your OTP for Email Verification is ${otp}`;
            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                email: 'foundoapplication@gmail.com',
                name: 'Foundo App',
            };
            const receivers = [
                {
                    email: userResult[0].email,
                },
            ];
            yield tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Verification OTP',
                textContent: `Verify your email by entering this OTP ${otp}`,
                htmlContent: `
          <h1>Foundo Application</h1>
          <h3>${message}</h3>`,
            });
            logger_1.default.info(`OTP sent to ${userResult[0].email}`);
            return res.status(200).send({ success: true });
        }
        return res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'user is not updated' });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, otp } = req.params;
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            return res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
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
        return res.status(400).send({
            error: 'Bad Request',
            errorMessage: `OTP Didn't Match`,
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const resetOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [userResult, __] = yield User_1.default.findUser({ id: Number(id) });
        if (!userResult || !userResult.length) {
            logger_1.default.error(`user not found with id ${id}`);
            return res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user not found' });
        }
        const [result, _] = yield User_1.default.updateUser({
            user: Object.assign(Object.assign({}, userResult[0]), { otp: 0 }),
            id: Number(id),
        });
        if (result === null || result === void 0 ? void 0 : result.affectedRows) {
            logger_1.default.info(`OTP reset for user ${id}`);
            return res.status(200).send({ success: true });
        }
        logger_1.default.error(`OTP reset failed for user ${id}`);
        return res.status(400).send({
            error: 'Bad Request',
            errorMessage: `Something went wrong`,
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
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