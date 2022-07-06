const promisePool = require('../db');
class UserSetting {
  constructor({ userId }) {
    this.userId = userId;
  }

  save() {
    let sql = `INSERT INTO usersSettings(user_id) VALUES(?)`;
    return promisePool.execute(sql, [this.userId]);
  }
  static delete({ id }) {
    let sql = `DELETE FROM usersSettings WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }
  static findOne({ id }) {
    let sql = `SELECT * FROM usersSettings WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }
}
module.exports = UserSetting;
