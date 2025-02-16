const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            'mongodb+srv://dijidynamics2024:1Password**12345!@evmdb.8l73c.mongodb.net/xaliaxdb?retryWrites=true&w=majority&appName=evmdb',
            {
                useNewUrlParser: true,  // Keep this
            }
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;