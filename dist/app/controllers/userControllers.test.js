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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../server");
const User_1 = __importDefault(require("../models/User"));
const UserSetting_1 = __importDefault(require("../models/UserSetting"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = require("../utils/index");
const constants_1 = require("../constants");
const customErrors_1 = require("../custom-errors/customErrors");
const mysqlError_1 = require("../middleware/mysqlError");
const salt = process.env.SALT;
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const user_base_url = constants_1.Routes.v1 + constants_1.Routes.users.base;
const x_auth_token = 'x-auth-token';
describe('User Controller', () => {
    let userId;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create a test user
        const hashedPassword = yield bcrypt_1.default.hash('testpassword', parseInt(salt));
        const user = new User_1.default({
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@test.com',
            password: hashedPassword,
        });
        const [result, _] = yield user.save();
        const userSetting = new UserSetting_1.default({
            fk_userId: result.insertId,
        });
        yield userSetting.save();
        userId = result.insertId;
        // create a JWT token for the test user
        token = (0, index_1.createToken)({
            id: userId,
            jwtSecret,
            maxAgeOfToken,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // delete the test user
        const [result, _] = yield User_1.default.deleteUser({ userId });
        expect(result.affectedRows).toBe(1);
    }));
    describe('signupUser', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signupUser)
                .send({
                firstName: 'New',
                lastName: 'User',
                email: 'newuser@test.com',
                password: 'newpassword',
            });
            expect(res.status).toBe(201);
            expect(res.body.user.firstName).toBe('New');
            expect(res.body.user.lastName).toBe('User');
            expect(res.body.user.email).toBe('newuser@test.com');
            expect(res.body.message).toBe('Account Created !');
        }));
        it('should return an error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signupUser)
                .send({});
            expect(res.status).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorName);
            expect(res.body.errorMessage).toBe('firstName, lastName, email and password are required');
        }));
        it('should return an error if email is already in use', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signupUser)
                .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@test.com',
                password: 'testpassword',
            });
            expect(res.status).toBe(409);
            expect(res.body.error).toBe('something went wrong');
            expect(res.body.errorMessage).toBe(mysqlError_1.errorMappings.ER_DUP_ENTRY.message);
        }));
    });
    describe('deleteUserById', () => {
        it('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .delete(user_base_url + `/3`)
                .set(x_auth_token, `${token}`);
            expect(res.status).toBe(200);
            expect(res.body.user.id).toBe(3);
            expect(res.body.success).toBe(true);
        }));
        it('should return an error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .delete(user_base_url + `/3`)
                .set(x_auth_token, `${token}`);
            expect(res.status).toBe(customErrors_1.customErrorMappings.NotFoundError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.NotFoundError.ErrorName);
            expect(res.body.errorMessage).toBe('user not found');
        }));
    });
    describe('signinUser', () => {
        it('should sign in a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signinUser)
                .send({ email: 'testuser@test.com', password: 'testpassword' });
            expect(res.status).toBe(200);
            expect(res.body.jwtToken).toBeDefined();
            expect(res.body.message).toBe('successfully loggedin');
            expect(res.body.user.firstName).toBe('Test');
            expect(res.body.user.lastName).toBe('User');
            expect(res.body.user.email).toBe('testuser@test.com');
            expect(res.body.user.password).toBe('');
        }));
        it('should return an error if email is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signinUser)
                .send({ password: 'testpassword' });
            expect(res.status).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorName);
            expect(res.body.errorMessage).toBe('email and password are required');
        }));
        it('should return an error if password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signinUser)
                .send({ email: 'testuser@test.com' });
            expect(res.status).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.ValidationError.ErrorName);
            expect(res.body.errorMessage).toBe('email and password are required');
        }));
        it('should return an error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signinUser)
                .send({ email: 'nonexistent@test.com', password: 'testpassword' });
            expect(res.status).toBe(customErrors_1.customErrorMappings.BadRequestError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.BadRequestError.ErrorName);
            expect(res.body.errorMessage).toBe('User not found');
        }));
        it('should return an error if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(server_1.app)
                .post(user_base_url + constants_1.Routes.users.signinUser)
                .send({ email: 'testuser@test.com', password: 'wrongpassword' });
            expect(res.status).toBe(customErrors_1.customErrorMappings.BadRequestError.ErrorStatusCode);
            expect(res.body.error).toBe(customErrors_1.customErrorMappings.BadRequestError.ErrorName);
            expect(res.body.errorMessage).toBe('password is incorrect');
        }));
    });
    afterAll(() => {
        server_1.server.close();
    });
});
//# sourceMappingURL=userControllers.test.js.map