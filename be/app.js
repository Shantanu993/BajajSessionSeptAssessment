const express = require("express");
const app = express();
const cors = require("cors");
const port = 3005;
const { connection } = require("./db");

app.use(express.json());
app.use(cors());

// Existing POST - Insert user data if all fields are present
app.post("/add", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("Please provide all the fields");
  }

  if (name.length <= 4) {
    return res.status(400).send("Name must have more than 4 characters");
  }

  connection.query(
    `INSERT INTO users VALUE (NULL, ?, ?, MD5(?), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [name, email, password],
    function (error, results) {
      if (error) {
        return res.status(500).send("Error inserting data");
      }
      res.send(`Data from ${name} inserted successfully!`);
    }
  );
});

// Existing GET - Fetch all users whose names start with "P"
app.get("/pname", (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE name LIKE 'P%'`,
    function (error, results) {
      if (error) throw error;
      res.json(results);
    }
  );
});

// Existing GET - Search user by input
app.get("/search", (req, res) => {
  let user_input = req.query.user_input;
  connection.query(
    `SELECT * FROM users WHERE name = ?`,
    [user_input],
    function (error, results) {
      if (error) throw error;
      res.json(results);
    }
  );
});

// Existing GET - Fetch all users
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", function (error, results) {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
