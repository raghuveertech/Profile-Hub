const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  console.log("Connecting to DB...");
  try {
    await mongoose.connect(db);
    console.log("Mongo DB connected");
  } catch (e) {
    console.error(e.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
