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
            role: role || 'tenant',
            phone
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
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

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        // Set cookies consistently
        res.cookie("token", token, { ...cookieConfig, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieConfig, maxAge: 7 * 24 * 60 * 60 * 1000 });

        // send OTP
        // await sendOTP(email);

        res.status(200).json({
            user: {
                userId: user._id,
                name: user.name,
                role: user.role,
                plan: user.plan,
            },
            token,
            refreshToken,
            success: true,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!payload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const token = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefresh = jwt.sign({ userId: payload.userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { ...cookieConfig, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", newRefresh, { ...cookieConfig, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ token, refreshToken: newRefresh });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", cookieConfig);
  res.clearCookie("refreshToken", cookieConfig);
  res.status(200).json({ message: "Logged out successfully" });
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

const saveProperty = async (req, res) => {
  const userId = req.session.userId; // or req.user.id if using JWT
  const { propertyId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (!propertyId) {
    return res.status(400).json({ message: 'Property ID is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicates
    if (user.savedProperties.includes(propertyId)) {
      return res.status(409).json({ message: 'Property already saved' });
    }

    user.savedProperties.push(propertyId);
    await user.save();

    res.status(200).json({ message: 'Property saved successfully', savedProperties: user.savedProperties });
  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    getUserProfile,
    updateUserProfile,
    saveProperty,
};