const promisePool = require('../db');
class ItemLocation {
  constructor({
    latitude,
    longitude,
    lostItemId,
    foundItemId,
    messageId = null,
  }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.lostItemId = lostItemId;
    this.foundItemId = foundItemId;
    this.messageId = messageId;
  }
  save() {
    let sql =
      'INSERT INTO itemslocations(latitude,longitude,lostItemId,foundItemId,messageId) VALUES(?,?,?,?,?)';
    return promisePool.execute(sql, [
      this.latitude,
      this.longitude,
      this.lostItemId,
      this.foundItemId,
      this.messageId,
    ]);
  }
  static deleteLocation({ itemId }) {
    let sql = 'DELETE FROM itemslocations WHERE lostItemId=? OR foundItemId=?';
    return promisePool.execute(sql, [itemId, itemId]);
  }
  static getLocation({ itemId }) {
    let sql =
      'SELECT * FROM itemslocations WHERE lostItemId=? OR foundItemId=?';
    return promisePool.execute(sql, [itemId, itemId]);
  }
}
module.exports = ItemLocation;
