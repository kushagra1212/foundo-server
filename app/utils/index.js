const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const loggger = require('../logger/logger');
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

// Replace 'YOUR_API_KEY' with your actual API key
const API_KEY = process.env.SENDINBLUE_API_KEY;
const API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendTransactionalEmail(requestData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        accept: 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    loggger.info(`Email sent successfully: ${responseData}`);
    return responseData;
  } catch (error) {
    loggger.error(`Error sending email: ${error.message}`);
    throw error;
  }
}

module.exports = {
  createToken,
  verifyToken,
  makeid,
  isBase64,
  convertURLToBase64,
  sendTransactionalEmail,
};
