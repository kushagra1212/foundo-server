import logger from '../logger/logger';
import { ItemBaseType } from '../types/types';

import promisePool from '../db';
import { OkPacket, RowDataPacket } from 'mysql2';
class Item {
  itemBase: ItemBaseType;
  constructor(itemBase: ItemBaseType) {
    this.itemBase = itemBase;
  }
  save() {
    let sql = `INSERT INTO item(itemName,color,dateTime,description,brand,city,category,fk_userId,isFounded) VALUES(?,?,?,?,?,?,?,?,?)`;

    return promisePool.execute(sql, [
      this.itemBase.itemName,
      this.itemBase.color,
      this.itemBase.dateTime,
      this.itemBase.description,
      this.itemBase.brand,
      this.itemBase.city,
      this.itemBase.category,
      this.itemBase.fk_userId,
      this.itemBase.isFounded,
    ]) as Promise<OkPacket[]>;
  }
  
  static findItem({ itemId }) {
    let sql = `SELECT * FROM ((SELECT * FROM item WHERE id=?) as i INNER JOIN (SELECT firstName as userFirstName,lastName as userLastName,profilePhoto as userProfilePhoto,id as userId from user) as u ON i.fk_userId=u.userId);`;
    return promisePool.execute(sql, [itemId]) as Promise<RowDataPacket[]>;
  }

  static deleteItem({ id }) {
    let sql = 'DELETE FROM item WHERE id=?';
    return promisePool.execute(sql, [id]);
  }
  static updateItem(itemId: number, itemName: string, itemContent: any) {
    let sql = `UPDATE item SET ${itemName}=? WHERE id=?`;
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
    itemName,
    description,
    city,
    latest='0',
    and = true,
  }:{
    limit: number,
    offset: number,
    userId?: number,
    founded?: number,
    category?: string,
    brand?: string,
    color?: string,
    itemName?: string,
    description?: string,
    city?: string,
    latest?: string,
    and?: boolean
  }) {
    let sql = 'SELECT * FROM item ';
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
    if (itemName) {
      validFields.push(itemName);
      sqlQuery.push('itemName = ?');
    }
    if (description) {
      validFields.push(description);
      sqlQuery.push('description = ?');
    }
    if (city) {
      validFields.push(city);
      sqlQuery.push('city = ?');
    }
    if (brand) {
      sqlQuery.push(`brand LIKE '%${brand}%'`);
    }
    if (color) {
      validFields.push(color);
      sqlQuery.push('color = ?');
    }
    if (userId !== undefined) {
      validFields.push(userId);
      sqlQuery.push('fk_userId = ?');
    }
    

    for (let i = 0; i < sqlQuery.length; i++) {
      if (i == 0) {
        sql = sql + ' WHERE ' + sqlQuery[i];
      } else if (and) {
        sql = sql + ' AND ' + sqlQuery[i];
      } else {
        sql = sql + ' OR ' + sqlQuery[i];
      }
    }
    if (latest=='1') {
      sql += ' ORDER BY createdAt DESC';
    }
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    sql = `SELECT * from user as u1 INNER JOIN (${sql}) as i1 on u1.id=i1.fk_userId;`;
    
    return promisePool.execute(sql, validFields) as Promise<any>;
  }
  static findItemBySearchStringRegExp({
    searchString,
    offset=0,
    limit=10,
    fk_userId=undefined,
    latest='1'
  }:{
    limit: number,
    offset: number,
    searchString: string,
    fk_userId?: number,
    latest?: string 
  }
  ) {
    let sql = `SELECT * FROM item WHERE CONCAT(category,itemName,description,city,brand,color) LIKE '%${searchString}%'`;
    let validFields = [];
    let sqlQuery = [];
    if (fk_userId !== undefined) {
      validFields.push(fk_userId);
      sqlQuery.push('fk_userId = ?');
    }
    validFields.push(Number(limit));
    validFields.push(Number(offset));

    for (let i = 0; i < sqlQuery.length; i++) {
      if (i == 0) {
        sql = sql + ' WHERE ' + sqlQuery[i];
      } else {
        sql = sql + ' OR ' + sqlQuery[i];
      }
    }

    if (latest=='1') {
      sql += ' ORDER BY createdAt DESC';
    }

    let CountSql = `SELECT count(*) as total from user as u1 INNER JOIN (${sql}) as i1 on u1.id=i1.fk_userId;`;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    sql = `SELECT * from user as u1 INNER JOIN (${sql}) as i1 on u1.id=i1.fk_userId;`;
  
    return Promise.all([
      promisePool.execute(sql),
      promisePool.execute(CountSql),
    ]) as Promise<any>;
  }

  static  findItemsByPostIds(postIds: number[]) {
    let sql = `SELECT * FROM item WHERE id IN (${postIds})`;
    return promisePool.execute(sql) as Promise<RowDataPacket[]>;
  }
}

export default Item;
