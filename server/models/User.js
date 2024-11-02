const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    alarms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alarm',
        },
    ],
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
        },
    ],
});

// Method to compare password
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
