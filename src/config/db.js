const Pool = require("pg").Pool;

const pool = new Pool({
  user: "",
  password: "",
  database: "",
  host: "localhost",
  port: 1234,
});
module.exports = pool;
