import promisePool from '../db';
import { ImageType } from '../types/types';

class ItemPicture {
  pictures: ImageType[];
  fk_itemId: number;
  constructor({ pictures, fk_itemId }:{pictures:ImageType[],fk_itemId:number}) {
    this.pictures = pictures;
    this.fk_itemId = fk_itemId;
  }
  save() {
    let sql = 'INSERT INTO itemPicture(url,fk_itemId) VALUES';
    let values = [];
    let picturesCount = this.pictures.length;
    while (picturesCount) {
      values.push(this.pictures[this.pictures.length - picturesCount].image);
      values.push(this.fk_itemId);
      sql += '(?,?)';
      picturesCount--;
      if (picturesCount) sql += ',';
    }
    return promisePool.execute(sql, values);
  }
  static deletePictures({ fk_itemId }) {
    let sql = 'DELETE FROM itemPicture WHERE fk_itemId=?';
    return promisePool.execute(sql, [fk_itemId]);
  }
  static getPictures({ limit, offset, fk_itemId }) {
    let sql =
      'SELECT * FROM itemPicture WHERE fk_itemId=? LIMIT ? OFFSET ?';
    return promisePool.execute(sql, [fk_itemId, limit, offset]);
  }
  static updateURL({ url, id }) {
    let sql = 'UPDATE itemPicture SET url=? WHERE id=?';
    return promisePool.execute(sql, [url, id]);
  }
};

export default ItemPicture;