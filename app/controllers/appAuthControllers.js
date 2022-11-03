const User = require('../models/User');
const utils = require('../utils/index');
const salt = process.env.SALT;
const bcrypt = require('bcrypt');
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
      });
      return;
    }
    const maxAgeOfJWTToken = 60 * 60; // Validity 1 Hour Only
    /* Taking old password as a secret [dynamic]
       Will be Validating while taking NewPassword       
    */
    const jwtSecret = toString(user[0].password);
    const token = utils.createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken: maxAgeOfJWTToken,
    });
    res.status(200).send({ email, token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const checkValidityofToken = async (req, res) => {
  try {
    res.status(200).send(req.decoded);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    let hashedPassword = await bcrypt.hash(password, parseInt(salt));
    const [user, _] = await User.changePassword({
      email: req?.user[0]?.email,
      password: hashedPassword,
    });
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
module.exports = { forgotPassword, checkValidityofToken, resetPassword };
