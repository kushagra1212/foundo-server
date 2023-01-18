const config = {
  host: process.env.FAWS_DB_HOST,
  user: process.env.FAWS_DB_USER,
  password: process.env.FAWS_DB_PASSWORD,
  port: process.env.FAWS_DB_PORT,
  database: process.env.FDATABASE,
};

module.exports = { config };
