const promisePool = require('../db');
class ItemPicture {
  constructor({ pictures, lostItemId, foundItemId }) {
    this.pictures = pictures;
    this.lostItemId = lostItemId;
    this.foundItemId = foundItemId;
  }
  save() {
    let sql = 'INSERT INTO itemspictures(url,lostItemId,foundItemId) VALUES';
    let values = [];
    let picturesCount = this.pictures.length;
    while (picturesCount) {
      values.push(this.pictures[this.pictures.length - picturesCount].image);
      values.push(this.lostItemId);
      values.push(this.foundItemId);
      sql += '(?,?,?)';
      picturesCount--;
      if (picturesCount) sql += ',';
    }
    return promisePool.execute(sql, values);
  }
  static deletePictures({ itemId }) {
    let sql = 'DELETE FROM itemspictures WHERE lostItemId=? OR foundItemId=?';
    return promisePool.execute(sql, [itemId, itemId]);
  }
  static getPictures({ limit, offset, itemId }) {
    let sql =
      'SELECT * FROM itemspictures WHERE lostItemId = ? OR foundItemId = ? LIMIT ? OFFSET ?';
    return promisePool.execute(sql, [itemId, itemId, limit, offset]);
  }
}
module.exports = ItemPicture;
