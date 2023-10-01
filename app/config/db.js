"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_POR),
    database: process.env.MYSQL_DATABASE,
};
exports.default = {
    config
};
//# sourceMappingURL=db.js.map