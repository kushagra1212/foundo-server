"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class User {
    constructor({ firstName, lastName, email, password }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    save() {
        let sql = `INSERT INTO user(firstName,lastName,email,password) VALUES(?,?,?,?)`;
        return db_1.default.execute(sql, [
            this.firstName,
            this.lastName,
            this.email,
            this.password,
        ]);
    }
    static findAllUsers({ limit, offset }) {
        let sql = `SELECT * FROM user LIMIT ? OFFSET ?`;
        return db_1.default.execute(sql, [limit, offset]);
    }
    static findUser({ id }) {
        let sql = `SELECT * FROM user WHERE id=?`;
        return db_1.default.execute(sql, [id]);
    }
    static updateUser({ user, id }) {
        let sql = `UPDATE user SET address=?,phoneNo=?,profilePhoto=?, countryCode=?, otp=?, isVerified=? WHERE id=?`;
        return db_1.default.execute(sql, [
            user.address,
            user.phoneNo,
            user.profilePhoto,
            user.countryCode,
            user.otp,
            user.isVerified,
            id,
        ]);
    }
    static changePassword({ email, password, }) {
        let sql = `UPDATE user SET password=? WHERE email=?`;
        return db_1.default.execute(sql, [password, email]);
    }
    static deleteUser({ userId }) {
        let sql = `DELETE FROM user WHERE id=?`;
        return db_1.default.execute(sql, [userId]);
    }
    static findUserByEmail({ userEmail }) {
        let sql = `SELECT * FROM user WHERE email=?`;
        return db_1.default.execute(sql, [userEmail]);
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map