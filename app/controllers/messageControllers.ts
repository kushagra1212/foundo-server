
import promisePool from '../db';
import Message from '../models/Message';

const addMessage = async (req, res) => {
  const {
    senderId,
    receiverId,
    message,
    title,
    isPhoneNoShared,
    isFound,
    location,
  } = req.body;
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
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    const [message, _] = await messageModel.save();
    if (isFound) {
      // const itemLocation = new ItemLocation({
      //   latitude: location.latitude,
      //   longitude: location.longitude,
      //   lostItemId: null,
      //   foundItemId: null,
      //   messageId: message.insertId,
      // });
      // await itemLocation.save();
    }
    await connection.commit();
    res.status(200).send({ messageId: message.insertId, success: true });
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  } finally {
    if (connection) connection.release();
  }
};
const getContactList = async (req, res) => {
  const { userId, limit, offset } = req.query;
  if (!userId || !limit || !offset)
    return res

      .status(400)

      .send({ error: 'Bad Request', errorMessage: 'Missing required fields' });

  try {
    const [rows, _] = await Message.getContactList({ userId, limit, offset });
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  }
};

const getMessages = async (req, res) => {
  // get message with limit and offset fields
  const { senderId, receiverId, limit, offset } = req.query;
  if (!senderId || !receiverId || !limit || !offset)
    return res
      .status(400)
      .send({ error: 'Bad Request', errorMessage: 'Missing required fields' });
  try {
    const [rows, _] = await Message.getMessages({
      senderId,
      receiverId,
      limit,
      offset,
    });
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send({ error: 'Bad Request', errorMessage: err.message });
  }
};

export default {
  addMessage,
  getContactList,
  getMessages,
};
