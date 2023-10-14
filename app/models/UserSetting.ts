import { UserSettingType } from '../types/types';

import promisePool from '../db';
import { OkPacket, RowDataPacket } from 'mysql2';
import { getSETQuery } from './model-utils';
import logger from '../logger/logger';

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
    ]) as Promise<RowDataPacket[]>;
  }

  static async updateUserSettingByUserId({
    userSetting,
    fk_userId,
  }: {
    userSetting: any;
    fk_userId: number;
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = `UPDATE userSetting SET ${getSETQuery(
          userSetting
        )} WHERE fk_userId=?`;
        const params = [...Object.values(userSetting), fk_userId];
        await promisePool.execute(sql, params);

        resolve({  success: true,message:'user setting updated successfully'  });
      } catch (err) {
        logger.error(`user Setting update failed for userId ${fk_userId}`);
        reject(err);
      }
    });
  }
}

export default UserSetting;
