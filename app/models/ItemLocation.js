"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class ItemLocation {
    constructor(itemLocation) {
        this.itemLocation = itemLocation;
    }
    save() {
        let sql = ` INSERT INTO itemLocation(fk_itemId,fk_locationId) VALUES(?,?)`;
        return db_1.default.execute(sql, [
            this.itemLocation.fk_itemId,
            this.itemLocation.fk_locationId,
        ]);
    }
    static deleteByItemId({ fk_itemId }) {
        let sql = ` DELETE FROM itemLocation WHERE fk_itemId=?`;
        return db_1.default.execute(sql, [fk_itemId]);
    }
    static getByItemId({ fk_itemId }) {
        let sql = ` SELECT * FROM itemLocation WHERE fk_itemId=?`;
        return db_1.default.execute(sql, [fk_itemId]);
    }
    static getCompleteLocationByItemId({ fk_itemId }) {
        let sql = ` SELECT * FROM location WHERE id=(SELECT fk_locationId FROM itemLocation WHERE fk_itemId=?)`;
        return db_1.default.execute(sql, [fk_itemId]);
        ;
    }
}
exports.default = ItemLocation;
//# sourceMappingURL=ItemLocation.js.map