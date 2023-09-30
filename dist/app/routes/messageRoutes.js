"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageControllers_1 = __importDefault(require("../controllers/messageControllers"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// POST  Create Message
router.post('/add', auth_1.auth, messageControllers_1.default.addMessage);
// GET  Get Contact List
router.get('/contact-list', auth_1.auth, messageControllers_1.default.getContactList);
// GET  Get Messages with limit and offset
router.get('/messages', auth_1.auth, messageControllers_1.default.getMessages);
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map