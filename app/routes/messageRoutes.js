const express = require('express');
const messageControllers = require('../controllers/messageControllers');
const { auth } = require('../middleware/auth');
const router = express.Router();

// POST  Create Message
router.post('/add', auth, messageControllers.addMessage);

// GET  Get Contact List
router.get('/contact-list', auth, messageControllers.getContactList);

// GET  Get Messages with limit and offset
router.get('/messages', auth, messageControllers.getMessages);

module.exports = router;
