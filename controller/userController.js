const User = require('../model/User');
// const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'client', // Default to 'client' if no role is provided
            phone
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//controller function for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        // Store user ID in session
        req.session.userId = user._id;

        return res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid'); // name used by express-session
        res.status(200).json({ message: 'Logout successful' });
    });
};


// Get user profile
const getUserProfile = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, phone } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updateUserProfile
};

// This code defines user-related operations such as registration, login, logout, and fetching user profiles.
// It uses Express.js for routing, Mongoose for MongoDB interactions, and bcrypt for password hashing.
// The `register` function checks if a user already exists, hashes the password, and saves the new user.
// The `login` function verifies the user's credentials, generates a JWT token, and sets it as a cookie.
// The `logout` function clears the token cookie, and the `getUserProfile` function retrieves the user's profile excluding the password.
// The code handles errors gracefully and returns appropriate HTTP status codes and messages.
// This code is typically used in a Node.js application that uses MongoDB as its database.
// It is essential for building user authentication and management features in a web application.
// It ensures that user data is stored in a structured way, making it easier to query and manipulate.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.
// This code is typically placed in a separate file (e.g., controller/user.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and middleware,
// to handle user-related operations like registration, login, and profile management.
// The User model can be used to create, read, update, and delete user documents in the MongoDB database.
// This code is essential for building user authentication and management features in a web application.
// The use of Mongoose allows for validation and type checking, ensuring data integrity.
// This code is typically placed in a separate file (e.g., controller/user.js) to keep the code organized.
// It can be used in conjunction with other parts of the application, such as routes and middleware,
// to handle user-related operations like registration, login, and profile management.