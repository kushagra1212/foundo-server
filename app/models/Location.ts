import { LocationType } from '../types/types';
import promisePool from '../db';
import { RowDataPacket } from 'mysql2';
import { getInsertQuery } from './model-utils';

class Location {
  location: LocationType;
  constructor(location: LocationType) {
    this.location = location;
  }
  save() {
    let sql = `INSERT INTO ${getInsertQuery('location', this.location)}`;
    return promisePool.execute(sql,Object.values(this.location)) as Promise<RowDataPacket[]>;
  }

  static deleteById({ id }) {
    let sql = ` DELETE FROM location WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }

  static getById({ id }) {
    let sql = ` SELECT * FROM location WHERE id=?`;
    return promisePool.execute(sql, [id]);
  }
}

export default Location;
