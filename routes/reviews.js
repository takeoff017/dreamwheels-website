const express = require('express');
const authMiddleware = require('../auth');

module.exports = (db) => {
    const router = express.Router();

    // Public: get all reviews
    router.get('/', (req, res) => {
        db.all('SELECT * FROM reviews', [], (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        });
    });

    // Admin only: add a review
    router.post('/', authMiddleware, (req, res) => {
        const { name, location, rating, text } = req.body;
        db.run(
            'INSERT INTO reviews (name, location, rating, text) VALUES (?, ?, ?, ?)',
            [name, location, rating, text],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ id: this.lastID, name, location, rating, text });
            }
        );
    });

    return router;
};
