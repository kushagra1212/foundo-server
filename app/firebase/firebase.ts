import { google } from 'googleapis';
const MESSAGING_SCOPE = `https://www.googleapis.com/auth/firebase.messaging`;
import https from 'https';
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

const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + process.env.FIREBASE_PROJECT_ID.split(String.raw`\n`).join('\n') + '/messages:send';
export function sendFcmMessage(fcmMessage) {
  getAccessToken().then(function (accessToken) {
    var options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      body: fcmMessage
    };
    var request = https.request(options, function (resp) {
      resp.setEncoding('utf8');
      resp.on('data', function (data) {
        console.log(`Message sent to Firebase for delivery, response:`);
        console.log(data,'data');
      });
    });
    request.on('error', function (err) {
      console.log(`Unable to send message to Firebase`);
      console.log(err);
    });
    request.write(JSON.stringify(fcmMessage));
    request.end();
  }).catch(function (err) {
    console.log(err);
  });
}
