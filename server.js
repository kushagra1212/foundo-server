require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./app/routes/userRoutes');
const userSettingRoutes = require('./app/routes/userSettingRoutes');
const itemRoutes = require('./app/routes/itemRoutes');
const itemPictureRoutes = require('./app/routes/itemPictureRoutes');
const PORT = process.env.PORT;

// cross origin policy
app.use(
  cors({
    credentials: true,
    cors: true,
    origin: process.env.ORG,
  })
);
// For parsing the cookies
app.use(cookieParser());
// application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true, origin: process.env.ORG }));

// starting the app
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// Handling Routes
// base Route
app.get('/', (req, res) => {
  res.send({ message: 'You hit the base route', success: true });
});

//user Routes
app.use('/v1/user', userRoutes);
app.use('/v1/user-setting', userSettingRoutes);
app.use('/v1/item', itemRoutes);
app.use('/v1/item-picture', itemPictureRoutes);
