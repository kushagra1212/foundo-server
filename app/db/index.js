const mysql = require('mysql2');
//const db = require('../config/db'); // Production
const db = require('../config/db-dev'); // Devlopment
const pool = mysql.createPool(db.config);
module.exports = pool.promise();
