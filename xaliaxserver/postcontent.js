const mongoose = require('mongoose');
const connectDB = require('./db');
const Contentpost = require('./models/userpost');

const postcontent = async () => {
    await connectDB(); // Ensure MongoDB is connected

    const sampleEmail = "bajis20280@gmail.com";

    const existingUser = await Contentpost.findOne({ email: sampleEmail });

    if (!existingUser) {
        const sampleUser = new Contentpost({
            email: sampleEmail,
            contentofpost: "test content",
            username: "Balaji K",
            createdAt: new Date(), // Fixed typo (createAt → createdAt)
            contentImage: "http://localhost:4002/uploads/chennai03.jpg"
        });

        await sampleUser.save();
        console.log("Sample User added");
    } else {
        console.log("Sample user already exists");
    }
    
    mongoose.connection.close(); // Close connection after inserting data
};

// Run the function only when this script is executed
postcontent();
