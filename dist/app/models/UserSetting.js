"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class UserSetting {
    constructor({ fk_userId }) {
        this.fk_userId = fk_userId;
    }
    save() {
        let sql = `INSERT INTO userSetting(fk_userId) VALUES(?)`;
        return db_1.default.execute(sql, [this.fk_userId]);
    }
    static delete({ fk_userId }) {
        let sql = `DELETE FROM userSetting WHERE fk_userId=?`;
        return db_1.default.execute(sql, [fk_userId]);
    }
    static findUserSetting({ fk_userId }) {
        let sql = `SELECT * FROM userSetting WHERE fk_userId=?`;
        return db_1.default.execute(sql, [fk_userId]);
    }
    static updateUserSetting({ userSetting }) {
        let sql = `UPDATE userSetting SET language=?,displayPhoneNo=?,displayProfilePhoto=?, displayAddress=? WHERE fk_userId=?`;
        return db_1.default.execute(sql, [
            userSetting.language,
            userSetting.displayPhoneNo,
            userSetting.displayProfilePhoto,
            userSetting.displayAddress,
            userSetting.fk_userId,
        ]);
    }
}
exports.default = UserSetting;
//# sourceMappingURL=UserSetting.js.map