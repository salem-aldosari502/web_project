const jwt = require("jsonwebtoken");
const User = require('../models/user_info');

async function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback-secret-key-change-in-production"
        );

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        req.user = decoded;
        req.userData = user;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Role not authorized"
            });
        }

        next();
    };
}

module.exports = { protect, authorizeRoles };
