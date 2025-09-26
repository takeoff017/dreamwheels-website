const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
    const router = express.Router();
    const SECRET = "supersecretkey";

    // Admin login
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!admin) return res.status(401).json({ message: "Invalid credentials" });

            const isMatch = bcrypt.compareSync(password, admin.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            const token = jwt.sign(
                { id: admin.id, username: admin.username },
                SECRET,
                { expiresIn: '1h' }
            );

            res.json({ token });
        });
    });

    return router;
};
