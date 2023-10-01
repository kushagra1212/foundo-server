import { PoolOptions } from "mysql2/typings/mysql";

 const config :PoolOptions= {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_POR),
  database: process.env.MYSQL_DATABASE,
};

export default{
  config
}