const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("HOME PAGE");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
