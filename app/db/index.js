const mysql = require('mysql2');
const db = require('../config/db');
const pool = mysql.createPool(db.config);

module.exports = pool.promise();
