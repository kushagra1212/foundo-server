import logger from '../logger/logger';
import { makeid, isBase64 } from '../utils';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

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

    if (!isBase64(base64)) {
      logger.error('base64 is not valid');
      return null;
    }

    const base64Data = Buffer.from(
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
      logger.info(`Successfully uploaded object ${Key} to bucket`);
    } catch (err) {
      logger.error(err);
    }
    const encodeFileName = encodeURIComponent(Key);
    return `${location}/${encodeFileName}`;
  }
  async delete(urlToDelete: string) {
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
      return logger.error(`urlToDelete is not valid: ${urlToDelete}`);
    }

    const splitOn = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com/`;
    let Key = urlToDelete.split(splitOn)[1]; // The `image/${makeid(4)}-user-id-${userId}.${type}`

    Key = decodeURIComponent(Key);
    console.log(Key, 'key to delete');
    const command = new DeleteObjectCommand({
      Bucket: FAWS_S3_BUCKET,
      Key, // required
    });

    try {
      const response = await this.client.send(command);
      logger.info(`Successfully deleted object ${Key} from bucket`);
    } catch (err) {
      logger.error(err);
    }
  }
}
module.exports = { S3Image };
