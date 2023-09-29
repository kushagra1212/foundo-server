import { UserSettingType } from '../types/types';

import promisePool from '../db';
import { RowDataPacket } from 'mysql2';

class UserSetting {
  fk_userId: number;
  constructor({ fk_userId }: { fk_userId: number }) {
    this.fk_userId = fk_userId;
  }

  save() {
    let sql = `INSERT INTO userSetting(fk_userId) VALUES(?)`;
    return promisePool.execute(sql, [this.fk_userId]);
  }
  static delete({ fk_userId }: { fk_userId: number }) {
    let sql = `DELETE FROM userSetting WHERE fk_userId=?`;
    return promisePool.execute(sql, [fk_userId]);
  }
  static findUserSetting({ fk_userId }: { fk_userId: number }) {
    let sql = `SELECT * FROM userSetting WHERE fk_userId=?`;
    return promisePool.execute(sql, [fk_userId]) as Promise<RowDataPacket[]>;
  }
  static updateUserSetting({ userSetting }: { userSetting: UserSettingType }) {
    let sql = `UPDATE userSetting SET language=?,displayPhoneNo=?,displayProfilePhoto=?, displayAddress=? WHERE fk_userId=?`;
    return promisePool.execute(sql, [
      userSetting.language,
      userSetting.displayPhoneNo,
      userSetting.displayProfilePhoto,
      userSetting.displayAddress,
      userSetting.fk_userId,
    ]);
  }
}

export default UserSetting;
