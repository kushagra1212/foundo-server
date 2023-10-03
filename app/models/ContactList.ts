import { OkPacket, RowDataPacket } from 'mysql2';
import promisePool from '../db';
import { contactMessageType, messageType } from '../types/types';

type contactType = {
  fk_user_Id_1: number;
  fk_user_Id_2: number;
  chat_enabled: number;
};

class ContactList {
  contact: contactType;
  constructor(contact: contactType) {
    this.contact = contact;
  }

  async saveIfNotExist() {
    const [rows, _] = await ContactList.isContactExist({
      fk_user_Id_1: this.contact.fk_user_Id_1,
      fk_user_Id_2: this.contact.fk_user_Id_2,
    });
    if (rows.length === 0) {
      return this.save();
    }
    return Promise.resolve(rows);
  }

  async save() {
    let sql = `INSERT INTO contactList(fk_user_Id_1,fk_user_Id_2,chat_enabled) VALUES(?,?,?)`;
    return promisePool.execute(sql, [
      this.contact.fk_user_Id_1,
      this.contact.fk_user_Id_2,
      this.contact.chat_enabled,
    ]) as Promise<OkPacket[]>;
  }

  static async isContactExist({
    fk_user_Id_1,
    fk_user_Id_2,
  }: {
    fk_user_Id_1: number;
    fk_user_Id_2: number;
  }) {
    let sql = `SELECT * FROM contactList WHERE (fk_user_Id_1=? AND fk_user_Id_2=?) OR (fk_user_Id_1=? AND fk_user_Id_2=?)`;
    return promisePool.execute(sql, [
      fk_user_Id_1,
      fk_user_Id_2,
      fk_user_Id_2,
      fk_user_Id_1,
    ]) as Promise<RowDataPacket[]>;
  }

  static async getContactList({
    fk_user_Id_1,
    limit,
    offset,
  }: {
    fk_user_Id_1: number;
    limit: number;
    offset: number;
  }) {
    let sql = `
    SELECT cl.*, u.*, COUNT(*) OVER () as total_count
    FROM (
      SELECT * 
      FROM contactList 
      WHERE fk_user_Id_1 = ? OR fk_user_Id_2 = ?
    ) AS cl
    INNER JOIN (
      SELECT *, id as fk_userId 
      FROM user
    ) AS u
    ON cl.fk_user_Id_1 = u.id OR cl.fk_user_Id_2 = u.id
    WHERE fk_userId != ?
    LIMIT ${limit} OFFSET ${offset};`;
    return promisePool.execute(sql, [fk_user_Id_1,fk_user_Id_1,fk_user_Id_1]) as Promise<RowDataPacket[]>;
  }
}

export default ContactList;
