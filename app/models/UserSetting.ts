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
      let connection;
      try {
        connection = await promisePool.getConnection();
        await connection.beginTransaction();

        let sql = `UPDATE userSetting SET ${getSETQuery(
          userSetting,
        )} WHERE fk_userId=?; `;

        const params = [...Object.values(userSetting), fk_userId];
        await connection.execute(sql, params);

        sql = `SELECT * FROM userSetting WHERE fk_userId=?`;

        const [userSettingResult, __] = await connection.execute(sql, [
          fk_userId,
        ]);

        await connection.commit();
        await connection.release();
        resolve(userSettingResult[0]);
      } catch (err) {
        if (connection) await connection.rollback();
        await connection.release();
        logger.error(`user Setting update failed for userId ${fk_userId}`);
        reject(err);
      }
    });
  }
}

export default UserSetting;
