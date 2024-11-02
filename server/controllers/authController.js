const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username: username.trim(),
            passwordHash,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Find user
        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN } // e.g., '365d'
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
