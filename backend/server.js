const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Main Page");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server Running on PORT ${PORT}`);
});
