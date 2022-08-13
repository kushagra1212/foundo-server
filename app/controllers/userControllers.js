const User = require('../models/User');
const UserSetting = require('../models/UserSetting');
const promisePool = require('../db');
const salt = process.env.SALT;
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days

//create Token
const createToken = (id) => {
  return jwt.sign({ id }, toString(jwtSecret), {
    expiresIn: maxAgeOfToken,
  });
};

//create user | POST
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let connection;
  try {
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
    res
      .status(201)
      .send({ user: { ...user, userId: result.insertId }, success: true });
  } catch (err) {
    if (connection) connection.rollback();
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  } finally {
    if (connection) connection.release();
  }
};

//SignIn user
const signinUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      res.status(400).send({ error: true, message: 'user not found' });
      return;
    }
    const isPasswordCorrect = bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      res.status(400).send({ error: true, message: 'password is incorrect' });
      return;
    }
    const token = createToken(user[0].id);
    res.status(200).send({
      jwtToken: token,
      message: 'successfully loggedin',
      user: user[0],
    });
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

//delete User based on userId | POST

const deleteUserById = async (req, res) => {
  const { userId } = req.body;
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
  try {
    const [userResult, __] = await User.findUser({ userId: id });
    if (!userResult || !userResult.length) {
      res
        .status(404)
        .send({ error: 'not found', errorMessage: 'user not found' });
    } else {
      res.status(200).send({ user: userResult[0] });
    }
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};

// Update User by Id
const updateUserbyId = async (req, res) => {
  const { userId, phoneNo, countryCode, profilePhoto, address } = req.body;
  try {
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
      if (profilePhoto && user.profilePhoto !== profilePhoto)
        user.profilePhoto = profilePhoto;
      if (address && user.address !== address) user.address = address;
      try {
        await User.updateUser({
          user: {
            phoneNo: user.phoneNo,
            countryCode: user.countryCode,
            profilePhoto: user.profilePhoto,
            address: user.address,
          },
          id: user.id,
        });

        res.status(200).send({ user });
      } catch (err) {
        res
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
module.exports = {
  signupUser,
  deleteUserById,
  getUserById,
  updateUserbyId,
  getAllUsers,
  signinUser,
};
