const ENV_PATH = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path: ENV_PATH });
import express from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './app/routes/userRoutes';
import userSettingRoutes from './app/routes/userSettingRoutes';
import postRoutes from './app/routes/postRoutes';
import authRoutes from './app/routes/app-authRoutes';
import messageRoutes from './app/routes/messageRoutes';
import pictureRoutes from './app/routes/pictureRoutes';
import rateLimit from 'express-rate-limit';
import mysqlErrorHandler from './app/middleware/mysqlError';
import { _errorHandler } from './app/middleware/errorHandler';
import { sendFcmMessage, sendFcmMessageLegacy } from './app/firebase/firebase';
import schedule from 'node-schedule';
import { sendMatchedItemsPushNotification } from './app/ai/notification';
import logger from './app/logger/logger';
const PORT = process.env.PORT || 8890;
//limiter object with  options
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 60, // max 100 requests per windowMs
  handler: function (req, res) {
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      errorMessage: 'Too many requests, please try again later.',
    });
  },
});

// Allow all for APP
app.use(
  cors({
    credentials: true,
    origin: '*',
  }),
);

// For parsing the cookies
app.use(cookieParser());
// application/json
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// starting the app
export const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Handling Routes
// base Route

app.post('/test/message', async (req, res) => {
  const fcmMessage = req.body;

  try {
    const data = await sendFcmMessageLegacy(fcmMessage);
    res.status(200).send({ message: 'Message sent', success: true ,data:data});
  } catch (err) {
    logger.info(err);
    res.status(500).send({ message: 'Message failed to send', success: false });
  }
});

app.get('/', limiter, (req, res) => {
  res.send({ message: 'You hit the base route', success: true });
});

// Auth Routes
app.use('/v1/app-auth', limiter, authRoutes);

// User Routes
app.use('/v1/users', limiter, userRoutes);

// User Setting Routes
app.use('/v1/user-setting', limiter, userSettingRoutes);

// Items Routes
app.use('/v1/posts', limiter, postRoutes);

// Pictures Routes
app.use('/v1/pictures', limiter, pictureRoutes);

// Messages Routes
app.use('/v1/messages', limiter, messageRoutes);

// Schedule push notifications to be sent every 24 hours (at midnight) | Currently disabled
// const job = schedule.scheduleJob('0 0 * * *', () => {
//   sendMatchedItemsPushNotification();
// });
// Error Handling

// middleware for handling mysql errors
app.use(mysqlErrorHandler);
app.use(_errorHandler);
