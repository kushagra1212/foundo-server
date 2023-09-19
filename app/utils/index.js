const jwt = require('jsonwebtoken');

// Create Token
const createToken = ({ id, jwtSecret, maxAgeOfToken }) => {
  return jwt.sign({ id }, toString(jwtSecret), {
    expiresIn: maxAgeOfToken,
    algorithm: process.env.JWT_ALGORITHM,
  });
};
// Verify Token
const verifyToken = ({ jwtToken, jwtSecret }) => {
  return jwt.verify(jwtToken, jwtSecret, {
    algorithm: process.env.JWT_ALGORITHM,
  });
};
const makeid = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = { createToken, verifyToken, makeid };
