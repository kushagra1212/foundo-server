const User = require('../models/User');
const UserSetting = require('../models/UserSetting');

//create user | POST
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = new User({ firstName, lastName, email, password });
  try {
    const [result, _] = await user.save();
    if (result.affectedRows) {
      try {
        const userSetting = new UserSetting({ userId: result.insertId });
        await userSetting.save();
      } catch (err) {
        res
          .status(400)
          .send({ error: 'Bad Request', errorMessage: 'user not created' });
        return;
      }

      res
        .status(201)
        .send({ user: { ...user, userId: result.insertId }, success: true });
    } else
      res
        .status(400)
        .send({ error: 'Bad Request', errorMessage: 'user not created' });
  } catch (err) {
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
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
      console.log(user);
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
module.exports = { signupUser, deleteUserById, getUserById, updateUserbyId };
