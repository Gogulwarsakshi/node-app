const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));


// ================= DATABASE =================
const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect(err => {
  if (err) {
    console.error("DB Connection Failed:", err);
    return;
  }
  console.log("MySQL Connected");
});


// ================= HOME PAGE =================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ================= ADD USER =================
app.post('/add-user', (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(400).send("Name required");
  }

  db.query(
    "INSERT INTO users (name) VALUES (?)",
    [name],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("DB Error");
      }
      res.send("User added");
    }
  );
});


// ================= GET USERS =================
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("DB Error");
    }
    res.json(result);
  });
});


// ================= SERVER START =================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
