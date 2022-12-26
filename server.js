const ejs = require("ejs");
const express = require("express");
const path = require("path");

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

app.listen(8080, () => {
  console.log("App running on port:8080");
});
