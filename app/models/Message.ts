import promisePool from '../db';

class Message {
  constructor({
    senderId,
    receiverId,
    message,
    title,
    isPhoneNoShared,
    isFound,
  }) {
    // this.senderId = senderId;
    // this.receiverId = receiverId;
    // this.message = message;

    // this.title = title;
    // this.isPhoneNoShared = isPhoneNoShared;
    // this.isFound = isFound;
  }
  save() {
    // let sql = `INSERT INTO messages(senderId,receiverId,message,title,isPhoneNoShared,isFound) VALUES(?,?,?,?,?,?)`;
    // return promisePool.execute(sql, [
    //   this.senderId,
    //   this.receiverId,
    //   this.message,
    //   this.title,
    //   this.isPhoneNoShared,
    //   this.isFound,
    // ]);
    return null;
  }
  static getContactList({ userId, limit, offset }) {
    let sql = `select m1.senderId,u1.firstName,u1.lastName,m1.messagesCount from (select distinct(senderId),count(*) as messagesCount from messages where receiverId=? group by senderId) as m1 inner join (select id,firstName,lastName from users) as u1 on m1.senderId=u1.id limit ? offset ?`;
    return promisePool.execute(sql, [userId, limit, offset]);
  }
  static getMessages({ senderId, receiverId, limit, offset }) {
    let sql = `SELECT * FROM (SELECT * FROM messages WHERE (senderId=? AND receiverId=?) OR (senderId=? AND receiverId=?)) AS u1  LEFT JOIN (SELECT latitude,longitude,messageId FROM itemslocations) AS i1 ON u1.id=i1.messageId ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    return promisePool.execute(sql, [
      senderId,
      receiverId,
      receiverId,
      senderId,
      limit,
      offset,
    ]);
  }
}

export default Message;