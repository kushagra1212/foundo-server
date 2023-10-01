import { OkPacket, RowDataPacket } from 'mysql2';
import promisePool from '../db';
import { messageType } from '../types/types';
import { getInsertQuery } from './model-utils';

class Message {
  message: messageType;
  constructor(message: messageType) {
    this.message = message;
  }
  async save() {
    let sql = `INSERT INTO ${getInsertQuery('message', this.message)}`;
    return promisePool.execute(sql, Object.values(this.message)) as Promise<OkPacket[]>;
  }

  static getContactList({
    fk_receiverId,
    limit,
    offset,
  }: {
    fk_receiverId: number;
    limit: number;
    offset: number;
  }) {
    let sql = `select m1.fk_senderId,u1.firstName,u1.lastName,m1.messagesCount from (select distinct(fk_senderId),count(*) as messagesCount from message where fk_receiverId=${fk_receiverId} group by fk_senderId) as m1 inner join (select id,firstName,lastName from user) as u1 on m1.fk_senderId=u1.id limit ${limit} offset ${offset}`;
    return promisePool.execute(sql);
  }

  static getMessages({
    fk_senderId,
    fk_receiverId,
    limit,
    offset,
  }: {
    fk_senderId: number;
    fk_receiverId: number;
    limit: number;
    offset: number;
  }) {
    let sql = `
    SELECT * from (SELECT * From ((SELECT * FROM message WHERE ((fk_senderId=${fk_senderId} AND fk_receiverId=${fk_receiverId}) OR (fk_senderId=${fk_senderId} AND fk_receiverId=${fk_receiverId}))) as m LEFT JOIN (SELECT location.latitude,location.longitude,messageLocation.fk_messageId,location.id as locationId FROM location INNER JOIN messageLocation where location.id=messageLocation.fk_locationId) as ml ON m.id=ml.fk_messageId)) as c1 
    LEFT JOIN contactMessage ON contactMessage.fk_messageId=c1.id ORDER BY createdAt DESC limit ${limit} offset ${offset};`;
    return promisePool.execute(sql) as Promise<RowDataPacket[]>;
  }
}

export default Message;
