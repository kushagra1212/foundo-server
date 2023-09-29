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
const makeid = length => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const isBase64 = str => {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
};

const convertURLToBase64 = url => {
  return new Promise(async (resolve, reject) => {
    if (isBase64(url)) {
      resolve(url);
      return;
    }
    const data = await fetch(url);
    const blob = await data.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

module.exports = {
  createToken,
  verifyToken,
  makeid,
  isBase64,
  convertURLToBase64,
};
