import { LocationType, MessageLocationType } from '../types/types';
import promisePool from '../db';
import { RowDataPacket } from 'mysql2';
import { getInsertQuery } from './model-utils';

class MessageLocation {
  messageLocation: MessageLocationType;
  constructor(messageLocation: MessageLocationType) {
    this.messageLocation = messageLocation;
  }
  save() {
    let sql = `INSERT INTO ${getInsertQuery(
      'messageLocation',
      this.messageLocation,
    )}`;

    return promisePool.execute(
      sql,
      Object.values(this.messageLocation),
    ) as Promise<RowDataPacket[]>;
  }

  static deleteById({ id }) {
    let sql = ` DELETE FROM messageLocation WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }

  static getById({ id }) {
    let sql = ` SELECT * FROM messageLocation WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }
}

export default MessageLocation;
