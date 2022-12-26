const ejs = require("ejs");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/singleplayer", (req, res) => {
  res.render("game");
});
app.get("/multiplayer", (req, res) => {
  res.send("MULTIPLAYER GAME");
});

app.listen(PORT, () => {
  console.log("App running on port: " + PORT);
});
