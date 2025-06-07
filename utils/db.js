require('dotenv').config();
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
        });
        console.log('Database connected Successfully');
    } catch (error) {
        console.error("Database connection error:", error)
    }
}

module.exports = { connectDB }