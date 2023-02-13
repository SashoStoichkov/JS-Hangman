const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameRoomInput = document.getElementById('gameRoomId');
const roomScreen = document.getElementById('roomScreen');
const initialScreen = document.getElementById('initialScreen');
const gameRoomId=document.getElementById('newGameRoomId');
const playGameButton = document.getElementById('playGame');
const playersNum = document.getElementById('playersNum');
const gameScreen = document.getElementById('gameScreen');
const socket = io.connect('http://localhost:8080');


const wordElement = document.getElementById("word");
const popup = document.getElementById("popup-container");
const finalMessage = document.getElementById("final-message");
const correctWord = document.getElementById('correctWord');

import { RandomWordGenerator } from "./RandomWordGenerator/index.js";

const generator = new RandomWordGenerator();

  async function randomWord() {
    let word = await generator.getRandomWord();
    return word;
}

let correctLetters=[];
function displayWord(selectedWord) {
  wordElement.innerHTML = `${selectedWord
    .split("")
    .map(
      (letter) =>
        `<span class="letter">${
          correctLetters.indexOf(letter) >= 0 ? letter : ""
        }</span>`
    )
    .join("")}`;

  const word = wordElement.innerText.replace(/\n/g, "");

  if (word === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    popup.style.display = "flex";
  }
}

const init = () => {
  initialScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  roomScreen.style.display = 'block';

}

const play = async () => {
  initialScreen.style.display='none';
  roomScreen.style.display='none';
  gameScreen.style.display='block';
  await randomWord().then((res) => correctWord.innerText = res);
}

const reset = () => {
  gameRoomInput.value='';
  playersNum.value='';
  roomScreen.style.display='none';
  gameScreen.style.display='none';
  initialScreen.style.display='blcok';
}


newGameButton.addEventListener('click', () => {
  socket.emit('newGame');
  init();
})

joinGameButton.addEventListener('click', () => {
  const roomId = gameRoomInput.value;
const selectedWord = correctWord.innerText;
  socket.emit('joinGame',roomId,selectedWord);
  init();
  
})

const handleInit = async (number) => {
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

const handleGameStart =  async () => {
  let selectedWord = '';
  await  play()
  .then(() => selectedWord=correctWord.innerText)
  .then(() => displayWord(selectedWord));
}


socket.on('init', handleInit);
socket.on('gameRoomId', handleRoomId);
socket.on('unknownRoom',handleUnknownRomm);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('gameStart',handleGameStart);
