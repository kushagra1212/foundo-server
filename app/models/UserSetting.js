const promisePool = require('../db');
class UserSetting {
  constructor({ userId }) {
    this.userId = userId;
  }

  save() {
    let sql = `INSERT INTO usersSettings(userId) VALUES(?)`;
    return promisePool.execute(sql, [this.userId]);
  }
  static delete({ userId }) {
    let sql = `DELETE FROM usersSettings WHERE userId=?`;
    return promisePool.execute(sql, [userId]);
  }
  static findUserSetting({ userId }) {
    let sql = `SELECT * FROM usersSettings WHERE userId=?`;
    return promisePool.execute(sql, [userId]);
  }
  static updateUserSetting({ userSetting }) {
    let sql = `UPDATE usersSettings SET language=?,displayPhoneNo=?,displayProfilePhoto=?, displayAddress=? WHERE userId=?`;
    return promisePool.execute(sql, [
      userSetting.language,
      userSetting.displayPhoneNo,
      userSetting.displayProfilePhoto,
      userSetting.displayAddress,
      userSetting.userId,
    ]);
  }
}
module.exports = UserSetting;
