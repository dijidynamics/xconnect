const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/user');

const addSampleuser = async () => {
    await connectDB(); //Ensure MongoDB is connected

    const sampleEmail = "bajis2023@gmail.com";
    const existingUser = await User.findOne({ email: sampleEmail});

    if (!existingUser) {
        const sampleUser = new User({
            email: sampleEmail,
            password: "1password!",
            username:  "Balaji K",
            createAt: new Date(),
            lastLogin: null,
            passwordResetAt: null
        });

        await sampleUser.save();
        console.log("Sample User addeed");
    } else {
        console.log("sample user already exists");
    }
    mongoose.connection.close(); // Close connection after inserting data
};
// Run the function only when this script is executed
addSampleuser();