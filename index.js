const express = require('express');
const mysql = require('mysql2');
const url = require('url');

const app = express();
app.use(express.json());
app.use(express.static('public'));


// ================= DB CONNECTION =================
const dbUrl = url.parse(process.env.MYSQL_URL);

const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.auth.split(':')[0],
  password: dbUrl.auth.split(':')[1],
  database: dbUrl.pathname.replace('/', ''),
  port: dbUrl.port
});

db.connect(err => {
  if (err) {
    console.error("DB Connection Failed:", err);
    return;
  }
  console.log("MySQL Connected");
});


// ================= HOME PAGE =================
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
