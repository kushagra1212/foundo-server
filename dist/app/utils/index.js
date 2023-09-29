var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
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
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    }
    catch (err) {
        return false;
    }
};
const convertURLToBase64 = url => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (isBase64(url)) {
            resolve(url);
            return;
        }
        const data = yield fetch(url);
        const blob = yield data.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
    }));
};
module.exports = {
    createToken,
    verifyToken,
    makeid,
    isBase64,
    convertURLToBase64,
};
//# sourceMappingURL=index.js.map