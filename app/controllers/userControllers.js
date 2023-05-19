const User = require('../models/User');
const UserSetting = require('../models/UserSetting');
const promisePool = require('../db');
const salt = process.env.SALT;
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const utils = require('../utils/index');
const { imageUpload, S3Image } = require('../s3/S3image');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
//create user | POST
const signupUser = async (req, res) => {
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
    let hashedPassword = await bcrypt.hash(password, parseInt(salt));
    connection = await promisePool.getConnection();
    connection.beginTransaction();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const [result, _] = await user.save();
    const userSetting = new UserSetting({ userId: result.insertId });
    await userSetting.save();
    connection.commit();
    res.status(201).send({
      user: { ...user, userId: result.insertId, password: '' },
      message: 'Account Created !',
    });
  } catch (err) {
    if (connection) connection.rollback();
    console.log(err.errno);
    let errorMessage = err.message;
    if (err.errno === 1062) {
      errorMessage = 'This Email is already in use !';
    }
    res.status(400).send({ error: 'Bad Request', errorMessage: errorMessage });
  } finally {
    if (connection) connection.release();
  }
};

//SignIn user
const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'email and password are required',
      });
      return;
    }
    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
      });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'password is incorrect' });
      return;
    }
    const token = utils.createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken,
    });
    res.status(200).send({
      jwtToken: token,
      message: 'successfully loggedin',
      user: { ...user[0], password: '' },
    });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

//delete User based on userId | POST

const deleteUserById = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'userId is required' });
    return;
  }
  try {
    const [userResult, __] = await User.findUser({ userId });
    if (!userResult || !userResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
      return;
    }
    const [result, _] = await User.deleteUser({ userId });
    if (result.affectedRows)
      res.status(200).send({ user: userResult[0], success: true });
    else
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user is not deleted' });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

// get user by user id | GET
const getUserById = async (req, res) => {
  const { id } = req.params;
  const userIdWhoMadeReq = req.jwt.id;
  if (!id) {
    res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'userId is required' });
    return;
  }
  try {
    const [userResult, __] = await User.findUser({ userId: id });
    const [userSettingResult, ___] = await UserSetting.findUserSetting({
      userId: id,
    });
    const userSetting = userSettingResult[0];

    if (!userResult || !userResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    } else {
      let user = userResult[0];
      if (Number(userIdWhoMadeReq) !== user.id) {
        if (!userSetting.displayPhoneNo) user = { ...user, phoneNo: null };
        if (!userSetting.displayAddress) user = { ...user, address: null };
        if (!userSetting.displayProfilePhoto)
          user = { ...user, profilePhoto: null };
      }
      res.status(200).send({ user });
    }
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

// Update User by Id
const updateUserbyId = async (req, res) => {
  const { userId, phoneNo, countryCode, profilePhoto, address } = req.body;

  try {
    if (!userId) throw new Error('userId is required');
    const [userResult, __] = await User.findUser({ userId });
    if (!userResult || !userResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    } else {
      let user = userResult[0];

      if (phoneNo && user.phoneNo !== phoneNo) user.phoneNo = phoneNo;
      if (countryCode && user.countryCode !== countryCode)
        user.countryCode = countryCode;
      if (profilePhoto && user.profilePhoto !== profilePhoto) {
        const s3ImageObj = new S3Image();

        await s3ImageObj.delete(user.profilePhoto);

        const location = await s3ImageObj.upload({
          id: userId,
          base64: profilePhoto,
          folderName: 'profilePhoto',
        });
        user.profilePhoto = location;
      }

      if (address && user.address !== address) user.address = address;
      try {
        await User.updateUser({
          user: {
            ...user,
            phoneNo: user.phoneNo,
            countryCode: user.countryCode,
            profilePhoto: user.profilePhoto,
            address: user.address,
          },
          id: user.id,
        });

        res.status(200).send({ user });
      } catch (err) {
        return res
          .status(400)
          .send({ error: 'Bad Request', errorMessage: 'user update failed ' });
      }
    }
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const getAllUsers = async (req, res) => {
  const { limit, offset } = req.query;
  try {
    if (!limit || !offset) {
      throw new Error('limit and offset are required');
    }
    const [allUsers, __] = await User.findAllUsers({ limit, offset });
    if (!allUsers || !allUsers.length) {
      res.status(404).send({ error: 'not found', errorMessage: 'no users' });
    } else {
      res.status(200).send({ allUsers: allUsers });
    }
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const sendOtp = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user id is required' });
      return;
    }
    const [userResult, __] = await User.findUser({ userId: id });
    if (!userResult || !userResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const [result, _] = await User.updateUser({
        user: {
          ...userResult[0],
          otp,
        },
        id,
      });
      if (result?.affectedRows) {
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
        await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: 'Verification OTP',
          textContent: `Verify your email by entering this OTP ${otp}`,
          htmlContent: `
          <h1>Foundo Application</h1>
          <h3>${message}</h3>`,
        });
        res.status(200).send({ success: true });
      } else {
        res
          .status(400)
          .send({ error: 'Bad Request', errorMessage: 'user is not updated' });
      }
    }
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const verifyOtp = async (req, res) => {
  const { id, otp } = req.params;
  try {
    const [userResult, __] = await User.findUser({ userId: id });
    if (!userResult || !userResult.length) {
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    }
    if (userResult[0].otp === Number(otp) && Number(otp) !== 0) {
      const [result, _] = await User.updateUser({
        user: {
          ...userResult[0],
          otp: 0,
          is_verified: 1,
        },
        id,
      });
      if (result?.affectedRows) {
        return res.status(200).send({
          user: { ...userResult[0], otp: 0, is_verified: 1 },
          success: true,
          message: 'Your Email has been Verified Successfully !',
        });
      }
    }
    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: `OTP Didn't Match`,
    });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

const resetOtp = async (req, res) => {
  const { id } = req.params;
  try {
    const [userResult, __] = await User.findUser({ userId: id });
    if (!userResult || !userResult.length) {
      return res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    }
    const [result, _] = await User.updateUser({
      user: {
        ...userResult[0],
        otp: 0,
      },
      id,
    });
    if (result?.affectedRows) {
      return res.status(200).send({ success: true });
    }
    return res.status(400).send({
      error: 'Bad Request',
      errorMessage: `Something went wrong`,
    });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
module.exports = {
  signupUser,
  deleteUserById,
  getUserById,
  updateUserbyId,
  getAllUsers,
  signinUser,
  sendOtp,
  verifyOtp,
  resetOtp,
};
