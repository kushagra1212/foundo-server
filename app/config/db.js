const config = {
  host: process.env.AWS_DB_HOST,
  user: process.env.AWS_DB_USER,
  password: process.env.AWS_DB_PASSWORD,
  port: process.env.AWS_DB_PORT,
  database: process.env.DATABASE,
};

module.exports = { config };
