const express = require("express");

const app = express();
app.use(express.json());

// import routes

// mount routes

app.get("/", (req, res) => {
  return res.send(`<h2>api homepage</h2>`);
});

module.exports = app;
