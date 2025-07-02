const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "1234567890",
  database: "postgres",
  host: "localhost",
  port: 1234,
});
module.exports = pool;
