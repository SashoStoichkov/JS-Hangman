const ejs = require("ejs");
const express = require("express");
const path = require("path");
const http = require('http');
const socket = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const { all } = require("axios");
const app = express();
const server = http.createServer(app);
const io = socket(server);

const axios = require('axios');

async function getRandomWord() {
  try {
    const response = await axios.get("https://random-word-api.herokuapp.com/word");
    return response.data[0];
  } catch (err) {
    console.log("(WordGenerator) Something went wrong");
    throw err;
  }
}
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
let state = {};

function emitGameStart(room,state) {
  io.sockets.in(room).emit('gameStart',state);
}

function emitGameOver(room,winner) {

}

function  emitGameState(roomName,state){

}

const {initGame} = require('./public/hangman')

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);
    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000);
}

io.on('connection', (socket) => {
  console.log('new player is connected');
  players[socket.id] = socket;
  socket.on('newGame', () => {
    let roomName = uuidv4();
    playerRooms[socket.id] = roomName;
    socket.emit('gameRoomId', roomName);
    socket.join(roomName);
    socket.number = 1;
    socket.emit('init', 1);

  })
  socket.on('joinGame', async (roomName) => {
    //console.log(io.sockets.adapter.rooms);
    const room = io.sockets.adapter.rooms.get(roomName);
    // console.log(room);

    let numPlayers = 0;
    if (room !== undefined) {
      numPlayers = room.size;
      // console.log(numPlayers);
    } else {
      socket.emit('unknownRoom');
      return;
    }
    if (numPlayers > 1) {
      socket.emit('tooManyPlayers');
      return;
    }
    playerRooms[socket.id] = roomName;
    socket.join(roomName);
    socket.number = 2;
    // socket.broadcast.emit('init', 2);
    // socket.emit('init',2);
    socket.emit('gameRoomId', roomName);
    io.sockets.in(roomName).emit('init', 2);
    let selectedWord = '';
    await getRandomWord().then((res) => selectedWord = res)
    .then(() => state[roomName] = initGame(selectedWord))
    .then(() => emitGameStart(roomName,state[roomName]));
    // state[roomName] = initGame();
    // emitGameStart(roomName);
  });

  socket.on('guess', () => {

  })

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
