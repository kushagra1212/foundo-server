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
    college,
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
    this.college = college;
  }
  save() {
    let sql = `INSERT INTO items(itemName,color,dateTime,description,brand,city,category,userId,isFounded,college) VALUES(?,?,?,?,?,?,?,?,?,?)`;
    if (this.college === undefined) this.college = null;
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
      this.college,
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
  static updateItem({ description, itemId }) {
    let sql = 'UPDATE items SET description=? WHERE id=?';
    return promisePool.execute(sql, [description, itemId]);
  }
  static findItemsByUserId({
    userId,
    limit,
    offset,
    founded,
    category,
    brand,
    color,
    college,
  }) {
    let sql = 'SELECT * FROM items';
    let validFields = [];
    let sqlQuery = [];
    if (founded !== undefined) {
      validFields.push(founded);
      sqlQuery.push('isFounded = ?');
    }
    if (category) {
      validFields.push(category);
      sqlQuery.push('category = ?');
    }
    if (brand) {
      validFields.push(brand);
      sqlQuery.push('brand = ?');
    }
    if (color) {
      validFields.push(color);
      sqlQuery.push('color = ?');
    }
    if (userId !== undefined) {
      validFields.push(userId);
      sqlQuery.push('userId = ?');
    }
    if (college) {
      validFields.push(college);
      sqlQuery.push('college = ?');
    }
    validFields.push(limit);
    validFields.push(offset);
    for (let i = 0; i < sqlQuery.length; i++) {
      if (i == 0) {
        sql = sql + ' WHERE ' + sqlQuery[i];
      } else {
        sql = sql + ' AND ' + sqlQuery[i];
      }
    }
    sql += ' LIMIT ? OFFSET ?';
    return promisePool.execute(sql, validFields);
  }
}

module.exports = Item;
