const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shanu@993",
  database: "node_ws_assessment",
});

connection.connect((err) => {
  if (err) {
    console.log(`DB connection error: ${err}`);
  } else {
    console.log("DB connected");
  }
});

module.exports = { connection };
