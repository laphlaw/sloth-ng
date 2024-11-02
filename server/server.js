// server/server.js

const path = require('path');       // Import path module
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const alarmRoutes = require('./routes/alarmRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/api/alarms', alarmRoutes);
app.use('/api/locations', locationRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send({ message: 'Sloth backend is running.' });
});

// Debugging: Log MONGO_URI
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB Connected.');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });
