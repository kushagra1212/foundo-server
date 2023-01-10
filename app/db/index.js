const mysql = require('mysql2');
//const db = require('../config/db');
const db = require('../config/db-dev');
const pool = mysql.createPool(db.config);
module.exports = pool.promise();
