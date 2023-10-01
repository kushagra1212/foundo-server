"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class Location {
    ;
    constructor(location) {
        this.location = location;
    }
    save() {
        let sql = ` INSERT INTO location(latitude,longitude) VALUES(?,?)`;
        return db_1.default.execute(sql, [
            this.location.latitude,
            this.location.longitude,
        ]);
    }
    static deleteById({ id }) {
        let sql = ` DELETE FROM location WHERE id=?`;
        return db_1.default.execute(sql, [id]);
    }
    static getById({ id }) {
        let sql = ` SELECT * FROM location WHERE id=?`;
        return db_1.default.execute(sql, [id]);
    }
}
exports.default = Location;
//# sourceMappingURL=Location.js.map