const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

app.post('/add-user', (req, res) => {
  const name = req.body.name;
  db.query("INSERT INTO users (name) VALUES (?)", [name], (err) => {
    if (err) throw err;
    res.send("User added!");
  });
});

app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => console.log("Server running"));
