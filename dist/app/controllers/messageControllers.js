var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Message = require('../models/Message');
const ItemLocation = require('../models/ItemLocation');
const promisePool = require('../db');
const addMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { senderId, receiverId, message, title, isPhoneNoShared, isFound, location, } = req.body;
    if (!senderId || !receiverId || !message || !title)
        return res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'Missing required fields' });
    const messageModel = new Message({
        senderId,
        receiverId,
        message,
        title,
        isPhoneNoShared,
        isFound,
    });
    let connection;
    try {
        connection = yield promisePool.getConnection();
        yield connection.beginTransaction();
        const [message, _] = yield messageModel.save();
        if (isFound) {
            const itemLocation = new ItemLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                lostItemId: null,
                foundItemId: null,
                messageId: message.insertId,
            });
            yield itemLocation.save();
        }
        yield connection.commit();
        res.status(200).send({ messageId: message.insertId, success: true });
    }
    catch (err) {
        if (connection)
            yield connection.rollback();
        res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
    }
    finally {
        if (connection)
            connection.release();
    }
});
const getContactList = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userId, limit, offset } = req.query;
    if (!userId || !limit || !offset)
        return res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'Missing required fields' });
    try {
        const [rows, _] = yield Message.getContactList({ userId, limit, offset });
        res.status(200).send(rows);
    }
    catch (err) {
        res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
    }
});
const getMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // get message with limit and offset fields
    const { senderId, receiverId, limit, offset } = req.query;
    if (!senderId || !receiverId || !limit || !offset)
        return res
            .status(400)
            .send({ error: 'Bad Request', errorMessage: 'Missing required fields' });
    try {
        const [rows, _] = yield Message.getMessages({
            senderId,
            receiverId,
            limit,
            offset,
        });
        res.status(200).send(rows);
    }
    catch (err) {
        res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
    }
});
module.exports = {
    addMessage,
    getContactList,
    getMessages,
};
//# sourceMappingURL=messageControllers.js.map