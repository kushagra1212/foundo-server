import { google } from 'googleapis';
const MESSAGING_SCOPE = `https://www.googleapis.com/auth/firebase.messaging`;
import https from 'https';
import node_fetch from 'node-fetch';
import logger from '../logger/logger';
const SCOPES = [MESSAGING_SCOPE];
function getAccessToken() {
  return new Promise(function (resolve, reject) {
    var jwtClient = new google.auth.JWT(
      process.env.FIREBASE_CLIENT_EMAIL.split(String.raw`\n`).join('\n'),
      null,
      process.env.FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
      SCOPES,
      null,
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

export function sendFcmMessage(fcmMessage) {
  const HOST = 'fcm.googleapis.com';
  const PATH =
    '/v1/projects/' +
    process.env.FIREBASE_PROJECT_ID.split(String.raw`\n`).join('\n') +
    '/messages:send';
  getAccessToken()
    .then(function (accessToken) {
      var options = {
        hostname: HOST,
        path: PATH,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        body: fcmMessage.message,
      };
      var request = https.request(options, function (resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (data) {
          console.log(`Message sent to Firebase for delivery, response:`);
          console.log(data, 'data');
        });
      });
      request.on('error', function (err) {
        console.log(`Unable to send message to Firebase`);
        console.log(err);
      });
      request.write(JSON.stringify(fcmMessage));
      request.end();
    })
    .catch(function (err) {
      console.log(err);
    });
}

export const sendFcmMessageLegacy = async fcmMessage => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await node_fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${process.env.FIREBASE_FCM_SERVICE_KEY_LEGACY}`,
        },
        body: JSON.stringify({
          to: fcmMessage.token,
          priority: 'high',
          data: {
            experienceId: `@${process.env.EXPO_USERNAME}/${process.env.EXPO_PROJECT_SLUG}`,
            scopeKey: `@${process.env.EXPO_USERNAME}/${process.env.EXPO_PROJECT_SLUG}`,
            title: fcmMessage.title,
            message: fcmMessage.message,
            image: fcmMessage.image,
            meta: fcmMessage.meta,
          },
        }),
      });
      console.log(fcmMessage.token, 'fcmMessage.token')
      const data = await res.json();

      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
};


export const sendSMS = async fcmMessage => {
  return new Promise(async (resolve, reject) => {
    try {
    } catch (err) {
      reject(err);
    }
  });
};
