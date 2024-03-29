const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const usersRouter = require("./routes/api/users");
const profileRouter = require("./routes/api/profile");
const postsRouter = require("./routes/api/posts");
const cors = require("cors");

const app = express();

// connect to database
connectDB();

// initialise middleware
app.use(express.json({ extended: false }));

// Use CORS for all routes
app.use(cors());

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// include routes
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
