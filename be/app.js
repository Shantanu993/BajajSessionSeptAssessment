const express = require("express");
const app = express();
const cors = require("cors");
const port = 3005;
const { connection } = require("./db");

app.use(express.json());
app.use(cors());

app.post("/add", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Please provide all the fields");
  }
  connection.query(
    `INSERT INTO users VALUE (NULL, "${name}", "${email}", MD5("${password}"),CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(`Data from ${name} inserted successfully!`);
    }
  );
});

app.get("/search", (req, res) => {
  let user_input = req.query.user_input;
  connection.query(
    `SELECT * FROM users WHERE name = "${user_input}"`,
    function (error, results, fields) {
      if (error) throw error;
      console.log("DB data: ", results);
      res.send(`${JSON.stringify(results)}`);
    }
  );
});

// Route to accept two query parameters and an operation symbol
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", function (error, results, fields) {
    if (error) throw error;
    console.log("DB data: ", results);
    res.send(`${JSON.stringify(results)}`);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
