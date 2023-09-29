"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ENV_PATH = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path: ENV_PATH });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./app/routes/userRoutes"));
const userSettingRoutes_1 = __importDefault(require("./app/routes/userSettingRoutes"));
const itemRoutes_1 = __importDefault(require("./app/routes/itemRoutes"));
const itemPictureRoutes_1 = __importDefault(require("./app/routes/itemPictureRoutes"));
const app_authRoutes_1 = __importDefault(require("./app/routes/app-authRoutes"));
const messageRoutes_1 = __importDefault(require("./app/routes/messageRoutes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const PORT = process.env.PORT || 8890;
//limiter object with  options
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 60,
    handler: function (req, res) {
        res.status(429).json({
            error: 'Too many requests, please try again later.',
            errorMessage: 'Too many requests, please try again later.',
        });
    },
});
// Allow all for APP
app.use((0, cors_1.default)({
    credentials: true,
    origin: '*',
}));
// For parsing the cookies
app.use((0, cookie_parser_1.default)());
// application/json
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
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
app.use('/v1/app-auth', limiter, app_authRoutes_1.default);
//user Routes
app.use('/v1/users', limiter, userRoutes_1.default);
app.use('/v1/user-setting', limiter, userSettingRoutes_1.default);
//Items Routes
app.use('/v1/item', limiter, itemRoutes_1.default);
app.use('/v1/item-picture', limiter, itemPictureRoutes_1.default);
// Messages Routes
app.use('/v1/message', limiter, messageRoutes_1.default);
//# sourceMappingURL=server.js.map