// const User = require('../model/User');

// // Middleware: Verifies if user is logged in via session
// const verifyToken = async (req, res, next) => {
//   try {
//     const userId = req.session.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: 'You are not logged in.',
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found.',
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Session verification error:', error.message);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error during session verification.',
//     });
//   }
// };

// // Middleware: Requires user with role 'admin'
// const verifyTokenAndAdmin = async (req, res, next) => {
//   try {
//     await verifyToken(req, res, async () => {
//       if (req.user.role === 'admin') {
//         return next();
//       } else {
//         return res.status(403).json({
//           success: false,
//           message: 'Access denied. Admin privileges required.',
//         });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred during authorization.',
//     });
//   }
// };

// // Middleware: Requires user with role 'client'
// const verifyTokenAndClient = async (req, res, next) => {
//   try {
//     await verifyToken(req, res, async () => {
//       if (req.user.role === 'client') {
//         return next();
//       } else {
//         return res.status(403).json({
//           success: false,
//           message: 'Access denied. Client privileges required.',
//         });
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'An error occurred during authorization.',
//     });
//   }
// };

const User = require('../model/User');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // get JWT from cookie
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  
module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
};

// module.exports = {
//   verifyToken,
//   verifyTokenAndAdmin,
//   verifyTokenAndClient,
// };

// This middleware checks if the user is logged in via session and has the required role.
// It can be used to protect routes that require authentication and specific user roles.
// It exports three middleware functions: verifyToken, verifyTokenAndAdmin, and verifyTokenAndClient.
// These functions can be used in your route definitions to enforce authentication and authorization.
// The verifyToken function checks if the user is logged in by verifying the session.
// If the user is logged in, it retrieves the user from the database and attaches it to the request object.
// The verifyTokenAndAdmin and verifyTokenAndClient functions extend the verifyToken function to check if the user has the required role.
// If the user does not have the required role, it returns a 403 Forbidden response.
// If the user is authenticated and has the required role, it calls the next middleware or route handler.
// This code is typically used in a Node.js application that uses Express.js for routing and MongoDB for data storage.
//     res.send('Welcome to the Real Estate API');
// });
//