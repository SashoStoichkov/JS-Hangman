const ejs = require("ejs");
const express = require("express");
const path = require("path");
const http = require('http');
const socket=require('socket.io');
const {v4:uuidv4} = require('uuid');
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const { all } = require("axios");

const app = express();
const server = http.createServer(app);
const io = socket(server);

// const corsOptions = {
//   origin: "https://api-free.deepl.com/v2/translate",
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/singleplayer", (req, res) => {
  res.render("game");
});

let players = {};
let playerRooms = {};

io.on('connection', (socket) => {
  console.log('new player is connected');
  players[socket.id] = socket;

  socket.on('newGame', () => {
   let roomName=uuidv4();
   playerRooms[socket.id]=roomName;
   socket.emit('gameRoomId',roomName);

   socket.join(roomName);
   socket.number=1;
   socket.emit('init',1);
   
  })

  socket.on('joinGame', (roomName) => {
    //console.log(io.sockets.adapter.rooms);
    const room = io.sockets.adapter.rooms.get(roomName);
    console.log(room);

    let numPlayers = 0;
    if(room !== undefined) {
      numPlayers=room.size;
      console.log(numPlayers);
    } else {
      socket.emit('unknownRoom');
      return;
    }

   if(numPlayers > 1) {
      socket.emit('tooManyPlayers');
      return;
    }

    playerRooms[socket.id]=roomName;
    socket.join(roomName);
    socket.number=2;
    socket.emit('init', 2);
    socket.emit('gameRoomId',roomName);
  });

  socket.on('disconnect', () => {
    console.log('a player is disconnected');
    delete players[socket.id];
  });
});

app.get("/multiplayer", (req, res) => {
  res.render("multiplayer");
});

server.listen(PORT, () => {
  console.log("App running on port: " + PORT);
});
