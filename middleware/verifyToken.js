const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Middleware: verify JWT from cookie or Authorization header
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req.user
    req.user = { _id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: only admin
const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    // verifyToken should have already set req.user
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    console.error('Admin verification error:', err.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  
module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
