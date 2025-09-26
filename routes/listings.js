const express = require('express');
const authMiddleware = require('../auth');

module.exports = (db) => {
    const router = express.Router();

    // Public: get all listings
    router.get('/', (req, res) => {
        db.all('SELECT * FROM listings', [], (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        });
    });

    // Admin only: add a new listing
    router.post('/', authMiddleware, (req, res) => {
        const { title, description, price } = req.body;
        db.run(
            'INSERT INTO listings (title, description, price) VALUES (?, ?, ?)',
            [title, description, price],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ id: this.lastID, title, description, price });
            }
        );
    });

    return router;
};
