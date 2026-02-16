const User = require("../model/User");
const jwt = require("jsonwebtoken");


// Verify token from httpOnly cookie OR Authorization header
const verifyToken = async (req, res, next) => {
  try {

    let token = null;

    // 1. Check cookie first (PRIMARY for httpOnly auth)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. Fallback to Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();

  } catch (err) {

    console.error("JWT verification error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });

  }
};



// Verify admin access
const verifyTokenAndAdmin = async (req, res, next) => {
  try {

    // ensure verifyToken was called first
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    // attach full user if needed
    req.user = user;

    next();

  } catch (err) {

    console.error("Admin verification error:", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });

  }
};


module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};
