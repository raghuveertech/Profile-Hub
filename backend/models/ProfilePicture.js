const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  profilepicture: {
    filename: { type: String },
    path: { type: String },
    size: { type: String },
  },
});

const PictureModel = mongoose.model("profilepictures", PictureSchema);

module.exports = PictureModel;
