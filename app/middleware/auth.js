const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
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
module.exports = { auth };
