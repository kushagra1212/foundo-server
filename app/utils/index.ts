import jwt, { VerifyOptions } from 'jsonwebtoken';
import fetch from 'node-fetch';
import loggger from '../logger/logger';
import { SENDINBLUE_API_URL } from '../constants';
// Create Token
export const createToken = ({
  id,
  jwtSecret,
  maxAgeOfToken,
}: {
  id: string | number;
  jwtSecret: jwt.Secret;
  maxAgeOfToken: string | number;
}): string => {
  const algorithm: jwt.Algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: maxAgeOfToken,
    algorithm,
  });
};
// Verify Token
export const verifyToken = ({ jwtToken, jwtSecret }) => {
  const algorithm: jwt.Algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm;
  const algorithms: jwt.Algorithm[] | undefined = [algorithm];
  const options: VerifyOptions = {
    algorithms: algorithms,
  };
  return jwt.verify(jwtToken, jwtSecret, options);
};
export const makeid = length => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if(!phoneNumber) return false;
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
}
export const isValidCountryCode = (countryCode: string): boolean => {
  if(!countryCode) return false;
  const regex = /^\d{1,4}$/;
  return regex.test(countryCode);
}

export const isValidPhoneNumberWithCountryCodeWithSign = (phoneNumber: string): boolean => {
  if(!phoneNumber) return false;
  const regex = /^\+\d{1,4}\d{10}$/;
  return regex.test(phoneNumber);
}

export const isBase64 = str => {
  if (str === '' || str.trim() === '') {
    return false;
  }
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
};

export const convertURLToBase64 = (
  url: string,
): Promise<string | ArrayBuffer> => {
  return new Promise(async (resolve, reject) => {
    if (isBase64(url)) {
      resolve(url);
      return;
    }
    const data = await fetch(url);
    const blob = (await data.blob()) as Blob;
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export async function sendTransactionalEmail(requestData) {
  try {
    const response = await fetch(SENDINBLUE_API_URL, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        accept: 'application/json',
        'api-key': process.env.SENDINBLUE_API_KEY,
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
