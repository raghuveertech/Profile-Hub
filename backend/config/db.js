const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.get("mongoDBURL"));
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
