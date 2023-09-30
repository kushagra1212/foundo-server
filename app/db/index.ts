import mysql from 'mysql2';
import db from '../config/db';
const pool = mysql.createPool(db.config);


export default pool.promise();
