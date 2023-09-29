var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const utils = require('../utils/index');
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token)
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided.' });
    try {
        const decoded = jwt.verify(token, toString(jwtSecret));
        req.jwt = decoded;
        next();
    }
    catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
const verifyResetToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, token } = req.params;
        const [user, _] = yield User.findUserByEmail({ userEmail: email });
        if (!user || !user.length) {
            res.status(400).send({
                error: 'Bad Request',
                errorMessage: 'Please check your email again !',
            });
            return;
        }
        const decoded = utils.verifyToken({
            jwtSecret: toString(user[0].password),
            jwtToken: token,
        });
        req.user = user;
        req.decoded = decoded;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            error: 'server error',
            errorMessage: 'Reset password link is invalid or has expired. Please try again !',
        });
    }
});
const verifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const decoded = utils.verifyToken({
            jwtSecret: toString(jwtSecret),
            jwtToken: token,
        });
        const [user, _] = yield User.findUser({ userId: decoded.id });
        if (!user || !user.length) {
            res.status(400).send({
                error: 'Bad Request',
                errorMessage: 'Please check your email again !',
            });
            return;
        }
        req.user = user;
        req.decoded = decoded;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
module.exports = { auth, verifyToken, verifyResetToken };
//# sourceMappingURL=auth.js.map