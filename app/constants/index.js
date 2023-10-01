"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = exports.TEST_JWT_TOKEN = exports.SENDINBLUE_API_URL = void 0;
exports.SENDINBLUE_API_URL = 'https://api.brevo.com/v3/smtp/email';
exports.TEST_JWT_TOKEN = process.env.TEST_JWT_TOKEN;
exports.Routes = {
    v1: '/v1',
    v2: '/v2',
    users: {
        base: '/users',
        sendOtp: '/send-otp',
        resetOtp: '/reset-otp',
        verifyOtp: '/verify-otp',
        signupUser: '/signup',
        signinUser: '/signin',
        getAllUsers: '/:limit/:offset',
        getUserById: '/:id',
        updateUserById: '/:id',
        deleteUserById: '/:id',
        deleteAllUsers: '/',
    },
    userSettings: {
        base: '/user-setting',
        getUserSettingByUserId: '/:userId',
        updateUserSettingbyUserId: '/:userId',
        updateUserSettingbyUserIdOptimized: '/optimized/:userId',
    },
    posts: {
        base: '/posts',
        getMatchesByItemId: '/matches/:itemId',
        getItemsbyUserId: '/user/:userId',
        getItemsBySearchString: '/search',
        deleteItemById: '/:id',
        getItemByItemId: '/:id',
        updateItemById: '/:id',
        getItems: '/',
        addItem: '/',
    },
};
//# sourceMappingURL=index.js.map