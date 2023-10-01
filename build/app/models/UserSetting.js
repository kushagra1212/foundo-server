"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const model_utils_1 = require("./model-utils");
const logger_1 = __importDefault(require("../logger/logger"));
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
    static updateUserSettingByUserId({ userSetting, fk_userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let connection;
                try {
                    connection = yield db_1.default.getConnection();
                    yield connection.beginTransaction();
                    let sql = `UPDATE userSetting SET ${(0, model_utils_1.getSETQuery)(userSetting)} WHERE fk_userId=?; `;
                    const params = [...Object.values(userSetting), fk_userId];
                    yield connection.execute(sql, params);
                    sql = `SELECT * FROM userSetting WHERE fk_userId=?`;
                    const [userSettingResult, __] = yield connection.execute(sql, [
                        fk_userId,
                    ]);
                    yield connection.commit();
                    yield connection.release();
                    resolve(userSettingResult[0]);
                }
                catch (err) {
                    if (connection)
                        yield connection.rollback();
                    yield connection.release();
                    logger_1.default.error(`user Setting update failed for userId ${fk_userId}`);
                    reject(err);
                }
            }));
        });
    }
}
exports.default = UserSetting;
//# sourceMappingURL=UserSetting.js.map