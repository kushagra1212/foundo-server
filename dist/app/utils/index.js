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
exports.sendTransactionalEmail = exports.convertURLToBase64 = exports.isBase64 = exports.makeid = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("../logger/logger"));
const constants_1 = require("../constants");
// Create Token
const createToken = ({ id, jwtSecret, maxAgeOfToken, }) => {
    const algorithm = process.env.JWT_ALGORITHM;
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, {
        expiresIn: maxAgeOfToken,
        algorithm,
    });
};
exports.createToken = createToken;
// Verify Token
const verifyToken = ({ jwtToken, jwtSecret }) => {
    const algorithm = process.env.JWT_ALGORITHM;
    const algorithms = [algorithm];
    const options = {
        algorithms: algorithms,
    };
    return jsonwebtoken_1.default.verify(jwtToken, jwtSecret, options);
};
exports.verifyToken = verifyToken;
const makeid = length => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.makeid = makeid;
const isBase64 = str => {
    if (str === '' || str.trim() === '') {
        return false;
    }
    try {
        return btoa(atob(str)) == str;
    }
    catch (err) {
        return false;
    }
};
exports.isBase64 = isBase64;
const convertURLToBase64 = (url) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, exports.isBase64)(url)) {
            resolve(url);
            return;
        }
        const data = yield (0, node_fetch_1.default)(url);
        const blob = (yield data.blob());
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
    }));
};
exports.convertURLToBase64 = convertURLToBase64;
function sendTransactionalEmail(requestData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(constants_1.SENDINBLUE_API_URL, {
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
            const responseData = yield response.json();
            logger_1.default.info(`Email sent successfully: ${responseData}`);
            return responseData;
        }
        catch (error) {
            logger_1.default.error(`Error sending email: ${error.message}`);
            throw error;
        }
    });
}
exports.sendTransactionalEmail = sendTransactionalEmail;
//# sourceMappingURL=index.js.map