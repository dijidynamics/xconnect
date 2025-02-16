const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  
    email: {
        type: String,
        required: true,
    },
    postcontent: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;