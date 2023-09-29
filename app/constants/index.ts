const LOSTITEMS = 'lostitems';
const FOUNDITEMS = 'founditems';

export const SENDINBLUE_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const TEST_JWT_TOKEN = process.env.TEST_JWT_TOKEN;


export const Routes = {
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
};
