"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSETQuery = void 0;
const getSETQuery = (body) => {
    let sqlUpdateString = '';
    const keys = Object.keys(body);
    const n = keys.length;
    for (let i = 0; i < n; i++) {
        sqlUpdateString += keys[i] + '=?';
        if (i != n - 1) {
            sqlUpdateString += ',';
        }
    }
    return sqlUpdateString;
};
exports.getSETQuery = getSETQuery;
//# sourceMappingURL=model-utils.js.map