const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in environment variables.');
      console.error('Please create a .env file with MONGODB_URI variable.');
      console.error('See ENV_SETUP.md for more information.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
