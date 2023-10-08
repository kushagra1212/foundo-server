export const Routes = {
    v1: '/v1',
    v2: '/v2',
    users: {
      base: '/users',
      sendOtp: '/send-otp/:id',
      resetOtp: '/reset-otp/:id',
      verifyOtp: '/verify-otp/:id/:otp',
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
    posts:{
      base: '/posts',
      getMatchesByItemId: '/matches/:itemId',
      getPostsByPostIds: '/post-ids',
      getItemsbyUserId: '/user/:userId',
      getItemsBySearchString: '/search',
      deleteItemById: '/:id',
      getItemByItemId: '/:id',
      updateItemById: '/:id',
      getItems: '/',
      addItem: '/',
    },
    pictures:{
      base: '/pictures',
      getItemPicturesByItemId: '/item/:itemId',
      addPictures: '/item',
    },
    messages:{
      base: '/messages',
      addContactMessage: '/contact',
      getContactList: '/contact-list/:fk_user_Id_1/:limit/:offset',
      getMessages: '/:fk_senderId/:fk_receiverId/:limit/:offset',
      getContact: '/:fk_user_Id_1/contact/:fk_user_Id_2',
      addMessage: '/',
    },
    appAuth:{
      base: '/app-auth',
      forgotPassword: '/forgot-password/:email',
      verifyResetPasswordToken: '/verify-reset-password-token/:email/:token',
      verifyToken: '/verify-token/:token',
      resetPassword: '/reset-password/:email/:token'
    }
  };
  