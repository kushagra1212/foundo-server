const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const utils = require('../utils/index');
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, toString(jwtSecret));
    console.log(token);
    req.jwt = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
const verifyResetToken = async (req, res, next) => {
  try {
    const { email, token } = req.params;
    console.log(req.params);
    const [user, _] = await User.findUserByEmail({ userEmail: email });
    if (!user || !user.length) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
      });
      return;
    }
    const decoded = utils.verifyToken({
      jwtSecret: toString(user[0].password),
      jwtToken: token,
    });
    console.log(user[0].password);
    req.user = user;
    req.decoded = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'server error',
      errorMessage:
        'Reset password link is invalid or has expired. Please try again !',
    });
  }
};
const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = utils.verifyToken({
      jwtSecret: toString(jwtSecret),
      jwtToken: token,
    });
    const [user, _] = await User.findUser({ userId: decoded.id });
    if (!user || !user.length) {
      res.status(400).send({
        error: 'Bad Request',
        errorMessage: 'Please check your email again !',
      });
      return;
    }
    req.user = user;
    req.decoded = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
module.exports = { auth, verifyToken, verifyResetToken };
