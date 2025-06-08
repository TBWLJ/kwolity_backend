// Middleware: Basic token verification
const jwt = require("jsonwebtoken");
const User = require('../model/User');

// Reusable helper
const getUserFromToken = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');
    return user;
};

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        req.user = await getUserFromToken(token);
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token'
        });
    }
};

// Admin-only middleware
const verifyTokenAndAdmin = async (req, res, next) => {
    try {
        // First verify token
        await verifyToken(req, res, async () => {
            // Now check role
            if (req.user && req.user.role === 'admin') {
                return next();
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin privileges required.'
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred during authorization'
        });
    }
};


// Middleware: Requires user with role 'client'
const verifyTokenAndClient = async (req, res, next) => {
    await verifyToken(req, res, () => {
        if (req.user.role === 'client') {
            return next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Client privileges required.'
            });
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndClient
};
