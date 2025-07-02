const Pool = require("pg").Pool;

const pool = new Pool({
  user: "",
  password: "",
  database: "postgres",
  host: "localhost",
  port: 1234,
});
module.exports = pool;
