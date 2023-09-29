const ENV_PATH = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path: ENV_PATH });
import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './app/routes/userRoutes';
import userSettingRoutes from './app/routes/userSettingRoutes';
import itemRoutes from './app/routes/itemRoutes';
import itemPictureRoutes from './app/routes/itemPictureRoutes';
import authRoutes from './app/routes/app-authRoutes';
import messageRoutes from './app/routes/messageRoutes';
import rateLimit from 'express-rate-limit';
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
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Handling Routes
// base Route
app.get('/', limiter, (req, res) => {
  res.send({ message: 'You hit the base route', success: true });
});

// Auth Routes
app.use('/v1/app-auth', limiter, authRoutes);

//user Routes
app.use('/v1/users', limiter, userRoutes);
app.use('/v1/user-setting', limiter, userSettingRoutes);

//Items Routes
app.use('/v1/item', limiter, itemRoutes);
app.use('/v1/item-picture', limiter, itemPictureRoutes);

// Messages Routes
app.use('/v1/message', limiter, messageRoutes);
