import {  LocationType } from "../types/types";
import promisePool from '../db';

class Location {
  location:LocationType;;
  constructor(location:LocationType) {
    this.location = location;
  }
  save() {
    let sql = ` INSERT INTO location(latitude,longitude) VALUES(?,?)`;
    return promisePool.execute(sql, [
        this.location.latitude,
        this.location.longitude,
    ]);
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