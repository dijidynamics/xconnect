const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only @gmail.com emails are allowed"]
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    passwordResetAt: {
        type: Date,
        default: null, // Initially, password reset date is null
    },
    profileImage: {
        type: String,  // Store the image URL or file path
        default: "http://147.93.96.202:4002/uploads/profile.jpg", // Default profile image
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;