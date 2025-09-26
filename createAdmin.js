const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// ✅ Use same DB file as server.js
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// CHANGE THESE VALUES 👇
const username = "admin";
const password = "password123";

const hashedPassword = bcrypt.hashSync(password, 10);

db.run(
  `INSERT INTO admins (username, password) VALUES (?, ?)`,
  [username, hashedPassword],
  function (err) {
    if (err) {
      console.error("❌ Error creating admin:", err.message);
    } else {
      console.log(`✅ Admin created successfully! Username: ${username}, ID: ${this.lastID}`);
    }
    db.close();
  }
);
