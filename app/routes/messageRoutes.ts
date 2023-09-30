import express from 'express';
import messageControllers from '../controllers/messageControllers';
import { auth } from '../middleware/auth';
const router = express.Router();

// POST  Create Message
router.post('/add', auth, messageControllers.addMessage);

// GET  Get Contact List
router.get('/contact-list', auth, messageControllers.getContactList);

// GET  Get Messages with limit and offset
router.get('/messages', auth, messageControllers.getMessages);

export default router;