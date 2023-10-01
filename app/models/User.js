const promisePool = require('../db');
class User {
  constructor({ firstName, lastName, email, password }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  save() {
    let sql = `INSERT INTO users(firstName,lastName,email,password) VALUES(?,?,?,?)`;
    return promisePool.execute(sql, [
      this.firstName,
      this.lastName,
      this.email,
      this.password,
    ]);
  }

  static findAllUsers({ limit, offset }) {
    let sql = `SELECT * FROM users LIMIT ? OFFSET ?`;
    return promisePool.execute(sql, [limit, offset]);
  }
  static findUser({ userId }) {
    let sql = `SELECT * FROM users WHERE id=?`;
    return promisePool.execute(sql, [userId]);
  }

  static updateUser({ user, id }) {
    let sql = `UPDATE users SET address=?,phoneNo=?,profilePhoto=?, countryCode=?, otp=?, is_verified=? WHERE id=?`;

    return promisePool.execute(sql, [
      user.address,
      user.phoneNo,
      user.profilePhoto,
      user.countryCode,
      user.otp,
      user.is_verified,
      id,
    ]);
  }
  static changePassword({ email, password }) {
    let sql = 'UPDATE users SET password=? WHERE email=?';
    return promisePool.execute(sql, [password, email]);
  }
  static deleteUser({ userId }) {
    let sql = `DELETE FROM users WHERE id=?`;
    return promisePool.execute(sql, [userId]);
  }
  static findUserByEmail({ userEmail }) {
    let sql = 'SELECT * FROM users WHERE email=?';
    return promisePool.execute(sql, [userEmail]);
  }
}
module.exports = User;