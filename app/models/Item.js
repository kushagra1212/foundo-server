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
  static updateItem(itemId, itemName, itemContent) {
    let sql = `UPDATE items SET ${itemName}=? WHERE id=?`;
    return promisePool.execute(sql, [itemContent, itemId]);
  }
  static findItemsByUserIdorAll({
    userId,
    limit,
    offset,
    founded,
    category,
    brand,
    color,
    college,
    latest,
  }) {
    let sql = 'SELECT * FROM items I1';
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
    if (latest === '1') {
      sql += ' ORDER BY createdAt DESC';
    }
    sql += ' LIMIT ? OFFSET ?';
    sql = `SELECT * from users as u1 INNER JOIN (${sql}) as i1 on u1.id=i1.userId;`;
    return promisePool.execute(sql, validFields);
  }
}

module.exports = Item;
