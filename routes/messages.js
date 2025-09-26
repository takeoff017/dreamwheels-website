const express = require('express');
const authMiddleware = require('../auth');

module.exports = (db) => {
    const router = express.Router();

    // Public: send a message
    router.post('/', (req, res) => {
        const { name, email, message } = req.body;
        db.run(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            [name, email, message],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ id: this.lastID, name, email, message });
            }
        );
    });

    // Admin only: view all messages
    router.get('/', authMiddleware, (req, res) => {
        db.all('SELECT * FROM messages', [], (err, rows) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(rows);
        });
    });

    // Admin only: reply to a message
    router.post('/:id/reply', authMiddleware, (req, res) => {
        const { reply } = req.body;
        const { id } = req.params;
        db.run(
            'UPDATE messages SET reply = ? WHERE id = ?',
            [reply, id],
            function (err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: "Reply saved!" });
            }
        );
    });

    return router;
};
