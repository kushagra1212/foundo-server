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

  static findUser({ userId }) {
    let sql = `SELECT * FROM users WHERE id=?`;
    return promisePool.execute(sql, [userId]);
  }
  static updateUser({ user, id }) {
    let sql = `UPDATE users SET address=?,phoneNo=?,profilePhoto=?, countryCode=? WHERE id=?`;
    return promisePool.execute(sql, [
      user.address,
      user.phoneNo,
      user.profilePhoto,
      user.countryCode,
      id,
    ]);
  }

  static deleteUser({ userId }) {
    let sql = `DELETE FROM users WHERE id=?`;
    return promisePool.execute(sql, [userId]);
  }
}
module.exports = User;
