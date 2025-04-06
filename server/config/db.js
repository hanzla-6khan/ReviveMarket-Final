const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONOGO_BD_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
