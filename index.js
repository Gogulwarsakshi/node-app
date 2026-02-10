const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'myapp'
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
