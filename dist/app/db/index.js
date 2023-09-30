"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const db_1 = __importDefault(require("../config/db"));
const pool = mysql2_1.default.createPool(db_1.default.config);
exports.default = pool.promise();
//# sourceMappingURL=index.js.map