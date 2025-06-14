const router = require('express').Router();
const {registerUser, loginUser, logout, getUserProfile, updateUserProfile, saveProperty} = require('../controller/userController');
const { verifyToken } = require('../middleware/verifyToken');

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// Save property route (requires authentication)
router.post('/save-property', verifyToken, saveProperty);

// User logout route
router.post('/logout', verifyToken, logout);

// User profile route (requires authentication)
router.get('/profile', verifyToken, getUserProfile);

// User profile update route (requires authentication)
router.put('/profile', verifyToken, updateUserProfile);


// Export the router
module.exports = router;