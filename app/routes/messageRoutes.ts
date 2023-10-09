import express from 'express';
import messageControllers from '../controllers/messageControllers';
import { auth } from '../middleware/auth';
import { Routes } from '../config/routes';
const router = express.Router();

/* Add Contact Message | POST */
router.post(Routes.messages.addContactMessage, auth, messageControllers.addContactMessage);

/* Get Contact List | GET */
router.get(
  Routes.messages.getContactList,
  auth,
  messageControllers.getContactList,
);

// GET  Get Messages with limit and offset
router.get(
  Routes.messages.getMessages,
  auth,
  messageControllers.getMessages,
);

/* Is A Contact | GET */
router.get(
  Routes.messages.getContact,
  auth,
  messageControllers.getContact,
);

/* Add Message | POST */
router.post(Routes.messages.addMessage, auth, messageControllers.addMessage);

export default router;
