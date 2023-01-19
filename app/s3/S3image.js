const { makeid } = require('../utils');

const AWS = require('aws-sdk');
const {
  FAWS_ACCESS_KEY_ID,
  FAWS_SECRET_ACCESS_KEY,
  FAWS_DEFAULT_REGION,
  FAWS_S3_BUCKET,
} = process.env;
class S3Image {
  s3;
  constructor() {
    // Configure AWS to use promise
    AWS.config.setPromisesDependency(require('bluebird'));
    AWS.config.update({
      accessKeyId: FAWS_ACCESS_KEY_ID,
      secretAccessKey: FAWS_SECRET_ACCESS_KEY,
      region: FAWS_DEFAULT_REGION,
      bucket: FAWS_S3_BUCKET,
    });
  }
  async upload({ base64, userId }) {
    // Ensure that you POST a base64 data to your server.
    // Let's assume the variable "base64" is one.
    const base64Data = new Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const s3 = new AWS.S3();
    // Getting the file type, ie: jpeg, png or gif
    const type = base64.split(';')[0].split('/')[1];

    // Generally we'd have an userId associated with the image
    // For this example, we'll simulate one

    // With this setup, each time your user uploads an image, will be overwritten.
    // To prevent this, use a different Key each time.
    // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
    const params = {
      Bucket: FAWS_S3_BUCKET,
      Key: `image/${makeid(4)}-user-id-${userId}.${type}`, // type is not required
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64', // required
      ContentType: `image/${type}`, // required. Notice the back ticks
    };

    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    let location = '';
    let key = '';
    try {
      const { Location, Key } = await s3.upload(params).promise();
      location = Location;
      key = Key;
    } catch (error) {
      console.log(error);
    }

    return location;

    // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
  }
  async delete(urlToDelete) {
    if (!urlToDelete) {
      return console.log('No url found to delete 😢');
    }
    console.log(urlToDelete, 'urlToDelete');
    const s3 = new AWS.S3();
    // see: https://gist.github.com/SylarRuby/b60eea29c1682519e422476cc5357b60
    const splitOn = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com/`;
    const Key = urlToDelete.split(splitOn)[1]; // The `image/${makeid(4)}-user-id-${userId}.${type}`
    console.log(Key, 'Key to delete');
    const params = {
      Bucket: FAWS_S3_BUCKET,
      Key, // required
    };

    // More on the deleteObject property:
    // see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
    const data = await s3.deleteObject(params).promise();
  }
}
module.exports = { S3Image };
