"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger/logger"));
const utils_1 = require("../utils");
const client_s3_1 = require("@aws-sdk/client-s3");
const { FAWS_ACCESS_KEY_ID, FAWS_SECRET_ACCESS_KEY, FAWS_DEFAULT_REGION, FAWS_S3_BUCKET, } = process.env;
class S3Image {
    constructor() {
        this.client = new client_s3_1.S3Client({
            region: FAWS_DEFAULT_REGION,
            credentials: {
                accessKeyId: FAWS_ACCESS_KEY_ID,
                secretAccessKey: FAWS_SECRET_ACCESS_KEY,
            },
        });
    }
    upload({ base64, id, folderName }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure that you POST a base64 data to your server.
            // Let's assume the variable "base64" is one.
            const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            // Getting the file type, ie: jpeg, png or gif
            const type = base64.split(';')[0].split('/')[1];
            const Key = `image/${folderName}/${(0, utils_1.makeid)(4)}-id-${id}.${type}`;
            const params = {
                Bucket: FAWS_S3_BUCKET,
                Key,
                Body: base64Data,
                ContentEncoding: 'base64',
                ContentType: `image/${type}`, // required. Notice the back ticks,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
            let location = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com`;
            try {
                const response = yield this.client.send(command);
                logger_1.default.info(`Successfully uploaded object ${Key} to bucket`);
            }
            catch (err) {
                logger_1.default.error(err);
            }
            const encodeFileName = encodeURIComponent(Key);
            return `${location}/${encodeFileName}`;
        });
    }
    delete(urlToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!urlToDelete ||
                urlToDelete === '' ||
                urlToDelete === null ||
                urlToDelete === undefined ||
                urlToDelete === 'undefined' ||
                urlToDelete === 'null' ||
                urlToDelete === ' ' ||
                urlToDelete === '  ' ||
                urlToDelete === '   ' ||
                (urlToDelete === null || urlToDelete === void 0 ? void 0 : urlToDelete.length) < 1) {
                return logger_1.default.error(`urlToDelete is not valid: ${urlToDelete}`);
            }
            const splitOn = `https://${FAWS_S3_BUCKET.toLowerCase()}.s3.${FAWS_DEFAULT_REGION.toLowerCase()}.amazonaws.com/`;
            let Key = urlToDelete.split(splitOn)[1]; // The `image/${makeid(4)}-user-id-${userId}.${type}`
            Key = decodeURIComponent(Key);
            console.log(Key, 'key to delete');
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: FAWS_S3_BUCKET,
                Key, // required
            });
            try {
                const response = yield this.client.send(command);
                logger_1.default.info(`Successfully deleted object ${Key} from bucket`);
            }
            catch (err) {
                logger_1.default.error(err);
            }
        });
    }
}
exports.default = S3Image;
//# sourceMappingURL=S3image.js.map