import { OkPacket } from 'mysql2';
import promisePool from '../db';
import { contactMessageType, messageType } from '../types/types';


type conatacMessageDatabaseType = {
  fk_messageId: number;
  isFound: number;
  isPhoneNoShared: number;
};

class ContactMessage {
  contactMessage: conatacMessageDatabaseType;
  constructor(contactMessage: conatacMessageDatabaseType) {
    this.contactMessage = contactMessage
  }
  async save() {
    let sql = `INSERT INTO contactMessage(fk_messageId,isFound,isPhoneNoShared) VALUES(?,?,?)`;
    return promisePool.execute(sql, [
        this.contactMessage.fk_messageId,
        this.contactMessage.isFound,
        this.contactMessage.isPhoneNoShared,
    ]) as Promise<OkPacket[]>;
  }
}

export default ContactMessage;
