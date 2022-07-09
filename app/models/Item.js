const promisePool = require('../db');
class Item {
  constructor({
    itemName,
    color,
    dateTime,
    description,
    brand,
    city,
    category,
    userId,
    isFounded,
  }) {
    this.itemName = itemName;
    this.color = color;
    this.dateTime = dateTime;
    this.description = description;
    this.brand = brand;
    this.city = city;
    this.category = category;
    this.userId = userId;
    this.isFounded = isFounded;
  }
  save() {
    let sql = `INSERT INTO items(itemName,color,dateTime,description,brand,city,category,userId,isFounded) VALUES(?,?,?,?,?,?,?,?,?)`;

    return promisePool.execute(sql, [
      this.itemName,
      this.color,
      this.dateTime,
      this.description,
      this.brand,
      this.city,
      this.category,
      this.userId,
      this.isFounded,
    ]);
  }
  static findItem({ itemId }) {
    let sql = `SELECT * FROM items WHERE id=?`;
    return promisePool.execute(sql, [itemId]);
  }
  static deleteItem({ itemId }) {
    let sql = 'DELETE FROM items WHERE id=?';
    return promisePool.execute(sql, [itemId]);
  }
}

module.exports = Item;
