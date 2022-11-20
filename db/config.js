const Pool = require("pg").Pool;
const path = require("path");

const pool = new Pool({
  user: "",
  password: "",
  host: "",
  port: "",
  database: "",
});

module.exports = pool;

// process.env.USER;
// process.env.PASSWORD;
// process.env.HOST;
// process.env.PORT;
// process.env.DATABASE;
