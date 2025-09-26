const jwt = require('jsonwebtoken');

// Make sure this matches the SECRET used in admin.js
const SECRET = "supersecretkey";

// Middleware to check if the request has a valid token
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: '❌ No token provided' });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: '❌ Invalid token' });
        }
        req.admin = decoded; // save admin info for later use
        next(); // continue to the route
    });
}

module.exports = authMiddleware;
