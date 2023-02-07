const jwt = require('jsonwebtoken');
var request = require('request').defaults({ encoding: null });

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
const toDataURL = (url, successCallback, errorCallback) => {
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      data =
        'data:' +
        response.headers['content-type'] +
        ';base64,' +
        Buffer.from(body).toString('base64');
      successCallback(data);
    } else errorCallback(error);
  });
};
const toDataURLWithPromise = (url) => {
  return new Promise((resolve, reject) => {
    toDataURL(
      url,
      (data) => resolve(data),
      (err) => reject(err)
    );
  });
};

module.exports = { createToken, verifyToken, makeid, toDataURLWithPromise };
