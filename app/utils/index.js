const jwt = require('jsonwebtoken');
// Create Token
const createToken = ({ id, jwtSecret, maxAgeOfToken }) => {
  return jwt.sign({ id }, toString(jwtSecret), {
    expiresIn: maxAgeOfToken,
  });
};
// Verify Token
const verifyToken = ({ jwtToken, jwtSecret }) => {
  return jwt.verify(jwtToken, jwtSecret);
};
module.exports = { createToken, verifyToken };
