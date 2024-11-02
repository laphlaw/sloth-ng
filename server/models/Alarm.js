const mongoose = require('mongoose');

const AlarmSchema = new mongoose.Schema({
    time: {
        type: String, // Format "HH:MM"
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    gpsLat: {
        type: Number,
        required: true,
    },
    gpsLng: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Alarm', AlarmSchema);
