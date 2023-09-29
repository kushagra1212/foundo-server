const { makeid } = require('../utils');

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const {
  FAWS_ACCESS_KEY_ID,
  FAWS_SECRET_ACCESS_KEY,
  FAWS_DEFAULT_REGION,
  FAWS_S3_BUCKET,
} = process.env;

class S3Image {
  client;
  constructor() {
    this.client = new S3Client({
      region: FAWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: FAWS_ACCESS_KEY_ID,
        secretAccessKey: FAWS_SECRET_ACCESS_KEY,
      },
    });
  }
  async upload({ base64, id, folderName }) {
    // Ensure that you POST a base64 data to your server.
    // Let's assume the variable "base64" is one.
    const base64Data = new Buffer.from(
      base64.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    // Getting the file type, ie: jpeg, png or gif
    const type = base64.split(';')[0].split('/')[1];

    const Key = `image/${folderName}/${makeid(4)}-id-${id}.${type}`;
    const params = {
      Bucket: FAWS_S3_BUCKET,
      Key, // type is not required
      Body: base64Data,
      ContentEncoding: 'base64', // required
      ContentType: `image/${type}`, // required. Notice the back ticks,
    };
    const command = new PutObjectCommand(params);

    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    let location = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com`;
    try {
      const response = await this.client.send(command);
      console.log("Successfully uploaded object's data", response);
    } catch (err) {
      console.error(err);
    }
    const encodeFileName = encodeURIComponent(Key);
    return `${location}/${encodeFileName}`;

    // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
  }
  async delete(urlToDelete) {
    if (
      !urlToDelete ||
      urlToDelete === '' ||
      urlToDelete === null ||
      urlToDelete === undefined ||
      urlToDelete === 'undefined' ||
      urlToDelete === 'null' ||
      urlToDelete === ' ' ||
      urlToDelete === '  ' ||
      urlToDelete === '   ' ||
      urlToDelete?.length < 1
    ) {
      return console.log('No url found to delete 😢');
    }
    // see: https://gist.github.com/SylarRuby/b60eea29c1682519e422476cc5357b60
    const splitOn = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com/`;
    let Key = urlToDelete.split(splitOn)[1]; // The `image/${makeid(4)}-user-id-${userId}.${type}`
    // console.log(Key, 'Key to delete');
    Key = decodeURIComponent(Key);
    console.log(Key, 'key to delete');
    const command = new DeleteObjectCommand({
      Bucket: FAWS_S3_BUCKET,
      Key, // required
    });

    try {
      const response = await this.client.send(command);
      console.log("Successfully deleted object's data", response);
    } catch (err) {
      console.error(err);
    }
  }
}
module.exports = { S3Image };
