const promisePool = require('../db');
class ItemLocation {
  constructor({ latitude, longitude, lostItemId, foundItemId }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.lostItemId = lostItemId;
    this.foundItemId = foundItemId;
  }
  save() {
    let sql =
      'INSERT INTO itemslocations(latitude,longitude,lostItemId,foundItemId) VALUES(?,?,?,?)';
    return promisePool.execute(sql, [
      this.latitude,
      this.longitude,
      this.lostItemId,
      this.foundItemId,
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
