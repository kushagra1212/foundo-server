const User = require('../models/User');
const utils = require('../utils/index');
const salt = process.env.SALT;
const bcrypt = require('bcrypt');
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please provide email !',
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
    const maxAgeOfJWTToken = 60 * 60 * 24 * 6; // Validity 6 Hour Only
    /* Taking old password as a secret [dynamic]
       Will be Validating while taking NewPassword       
    */
    const jwtSecret = toString(user[0].password);
    const token = utils.createToken({
      id: user[0].id,
      jwtSecret,
      maxAgeOfToken: maxAgeOfJWTToken,
    });
    const sender = {
      email: 'foundoapplication@gmail.com',
      name: 'Foundo App',
    };
    const receivers = [
      {
        name: user[0].name,
        email: email,
      },
    ];
    let resetPasswordLink = `${process.env.RESET_PASS_APP_URL}`;
    await utils.sendTransactionalEmail({
      sender,
      to: receivers,
      subject: 'Foundo! Reset Your Password',
      textContent: `Reset Password Link`,
      htmlContent: `
          <h1>Foundo Application</h1>
          <h3>Here is your reset password Link</h3>
          <a href="${resetPasswordLink}/${email}/${token}">Reset Password</a>`,
    });

    res.status(200).send({ message: 'Email sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
const checkValidityofResetPasswordToken = async (req, res) => {
  try {
    res.status(200).send({ ...req.decoded, user: req.user[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'server error',
      errorMessage: err.message,
    });
  }
};
const checkValidityofToken = async (req, res) => {
  try {
    res.status(200).send({ ...req.decoded, user: req.user[0] });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'server error',
      errorMessage: err.message,
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please provide password !',
      });
      return;
    }
    let hashedPassword = await bcrypt.hash(password, parseInt(salt));
    const [user, _] = await User.changePassword({
      email: req?.user[0]?.email,
      password: hashedPassword,
    });
    res.send({ user, message: 'Password Changed Successfully !' });
  } catch (err) {
    res
      .status(500)
      .send({ error: 'server error', errorMessage: 'Token Expired ' });
  }
};
module.exports = {
  forgotPassword,
  checkValidityofToken,
  resetPassword,
  checkValidityofToken,
  checkValidityofResetPasswordToken,
};
