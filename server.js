const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import routes
const adminRoutes = require('./routes/admin');
const listingsRoutes = require('./routes/listings');
const reviewsRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Absolute path to database file
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Database connected at', dbPath);
    }
});

// ✅ Create tables if they don’t exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        price REAL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        rating INTEGER,
        text TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        reply TEXT
    )`);

    // ✅ Test table (just to confirm DB works)
    db.run(`CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`, (err) => {
        if (err) console.error("❌ Test table failed:", err.message);
        else console.log("✅ Test table created (DB is working)");
    });
});

// ✅ Default route
app.get('/', (req, res) => {
    res.send('✅ Backend server is running. Use /admin, /listings, /reviews, or /messages.');
});

// ✅ Use routes
app.use('/admin', adminRoutes(db));
app.use('/listings', listingsRoutes(db));
app.use('/reviews', reviewsRoutes(db));
app.use('/messages', messagesRoutes(db));

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
