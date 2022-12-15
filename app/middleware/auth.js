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
    req.jwt = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
const verifyToken = async (req, res, next) => {
  try {
    const { email, token } = req.params;
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
      jwtToken: JSON.stringify(token),
    });
    console.log(user[0].password);
    req.user = user;
    req.decoded = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'server error', errorMessage: err.message });
  }
};
module.exports = { auth, verifyToken };
