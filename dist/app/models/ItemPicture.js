"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class ItemPicture {
    constructor({ pictures, fk_itemId }) {
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
            if (picturesCount)
                sql += ',';
        }
        return db_1.default.execute(sql, values);
    }
    static deletePictures({ fk_itemId }) {
        let sql = 'DELETE FROM itemPicture WHERE fk_itemId=?';
        return db_1.default.execute(sql, [fk_itemId]);
    }
    static getPictures({ limit, offset, fk_itemId }) {
        let sql = 'SELECT * FROM itemPicture WHERE fk_itemId=? LIMIT ? OFFSET ?';
        return db_1.default.execute(sql, [fk_itemId, limit, offset]);
    }
    static updateURL({ url, id }) {
        let sql = 'UPDATE itemPicture SET url=? WHERE id=?';
        return db_1.default.execute(sql, [url, id]);
    }
}
;
exports.default = ItemPicture;
//# sourceMappingURL=ItemPicture.js.map