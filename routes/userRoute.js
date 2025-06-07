const router = require('express').Router();
const {registerUser, loginUser, getUserProfile, updateUserProfile} = require('../controller/userController');

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// User profile route (requires authentication)
router.get('/profile', verifyToken, getUserProfile);

// User profile update route (requires authentication)
router.put('/profile/:userId', verifyToken, updateUserProfile);


// Export the router
module.exports = router;