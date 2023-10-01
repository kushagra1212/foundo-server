import { ItemLocationType } from "../types/types";
import promisePool from '../db';

class ItemLocation {
  itemLocation:ItemLocationType;
  
  constructor(itemLocation:ItemLocationType) {
    this.itemLocation = itemLocation;
  }

  save() {
    let sql = ` INSERT INTO itemLocation(fk_itemId,fk_locationId) VALUES(?,?)`;
    return promisePool.execute(sql, [
      this.itemLocation.fk_itemId,
      this.itemLocation.fk_locationId,
    ]);
  }

  static deleteByItemId({ fk_itemId }) {
    let sql = ` DELETE FROM itemLocation WHERE fk_itemId=?`;
    return promisePool.execute(sql, [fk_itemId]);
  }

  static getByItemId({ fk_itemId }) {
    let sql =
      ` SELECT * FROM itemLocation WHERE fk_itemId=?`;
    return promisePool.execute(sql, [fk_itemId]);
  }

  static getCompleteLocationByItemId({ fk_itemId }) {
    let sql =
      ` SELECT * FROM location WHERE id=(SELECT fk_locationId FROM itemLocation WHERE fk_itemId=?)`;
    return promisePool.execute(sql, [fk_itemId]);;
  }
}

export default ItemLocation;