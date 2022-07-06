require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./app/routes/userRoutes');
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
