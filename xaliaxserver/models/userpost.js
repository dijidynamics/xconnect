const mongoose = require('mongoose');

const contentpostSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
    },
    contentofpost: {
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
    contentImage: {
        type: String,  // Store the image URL or file path
        default: "http://localhost:4002/uploads/chennai03.jpg", // Default profile image
    },
});

const Contentpost = mongoose.model('contentpost', contentpostSchema);
module.exports = Contentpost;