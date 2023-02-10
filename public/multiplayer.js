const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameRoomInput = document.getElementById('gameRoomId');
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const gameRoomId=document.getElementById('newGameRoomId');
const playGameButton = document.getElementById('playGame');
const playersNum = document.getElementById('playersNum');
const socket = io.connect('http://localhost:8080');

let gameActive=false;

const init = () => {
  initialScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  gameActive=true;
  if(socket.number === 1) {
    console.log('socket num 1 ')
  }
  if(socket.number === 2){
    console.log('socket num 2 ');
  }
}

const reset = () => {
  gameRoomInput.value='';
  playersNum.value='';
  gameScreen.style.display='none';
  initialScreen.style.display='blcok';
}


newGameButton.addEventListener('click', () => {
  socket.emit('newGame');
  init();
})

joinGameButton.addEventListener('click', () => {
  const roomId = gameRoomInput.value;
  socket.emit('joinGame',roomId);
  init();
})

playGameButton.addEventListener('click', () => {
  const numPlayers= playersNum.innerText;
  if(numPlayers == 1) {
    alert('Please,wait another player to join');
    return;
   }
 
   // TODO: start to play game
})

const handleInit = (number) => {
  playersNum.innerText = number;
}

const handleRoomId = (roomId) => {
  gameRoomId.innerText = roomId;
}

const handleUnknownRomm = () => {
  reset();
  window.location.reload();
  alert('Unknown Room Id');
}

const handleTooManyPlayers = () => {
  reset();
  alert('This game is already in progress');
  window.location.reload();
}

socket.on('init', handleInit);
socket.on('gameRoomId', handleRoomId);
socket.on('unknownRoom',handleUnknownRomm);
socket.on('tooManyPlayers', handleTooManyPlayers);