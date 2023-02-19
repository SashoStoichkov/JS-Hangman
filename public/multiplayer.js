const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameRoomInput = document.getElementById('gameRoomId');
const roomScreen = document.getElementById('roomScreen');
const initialScreen = document.getElementById('initialScreen');
const gameRoomId = document.getElementById('newGameRoomId');
const playGameButton = document.getElementById('playGame');
const playersNum = document.getElementById('playersNum');
const gameScreen = document.getElementById('gameScreen');
const socket = io.connect('http://localhost:8080');


const wordElement = document.getElementById("word");
const wrongLettersElement = document.getElementById("wrong-letters");
const buttonPlayAgain = document.getElementById("play");
const popup = document.getElementById("popup-container");
const message = document.getElementById("message-container");
const existLetter = document.getElementById("exist-letter");
const notLetter = document.getElementById("not-letter");
const finalMessage = document.getElementById("final-message");
const hangmanParts = document.querySelectorAll(".hangman-part");
const wrongLettersContainer = document.getElementById("wrong-letters-container");
const capsLock = document.getElementById('caps-lock')

import { RandomWordGenerator } from "./RandomWordGenerator/index.js";

const generator = new RandomWordGenerator();

async function randomWord() {
  let word = await generator.getRandomWord();
  return word;
}

// let correctLetters = [];
function displayWord(selectedWord,correctLetters) {
  wordElement.innerHTML = `${selectedWord
    .split("")
    .map(
      (letter) =>
        `<span class="letter">${correctLetters.indexOf(letter) >= 0 ? letter : ""
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

const play = () => {
  initialScreen.style.display = 'none';
  roomScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  // await randomWord().then((res) => correctWord.innerText = res);
}

const reset = () => {
  gameRoomInput.value = '';
  playersNum.value = '';
  roomScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  initialScreen.style.display = 'block';
}


newGameButton.addEventListener('click', () => {
  socket.emit('newGame');
  init();
})

joinGameButton.addEventListener('click', () => {
  const roomId = gameRoomInput.value;
  socket.emit('joinGame', roomId);
  init();

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

function updateWrongLetters() {
  wrongLettersContainer.style.display = "flex";

  wrongLettersElement.innerHTML = `${wrongLetters.length > 0 ? "<p>Wrong letters</p>" : ""
    }${wrongLetters.map((letter) => `<span>${letter}</span>`)}`;

  hangmanParts.forEach((part, index) => {
    const mistakes = wrongLetters.length;

    if (index < mistakes) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  if (wrongLetters.length === hangmanParts.length) {
    finalMessage.innerText = `You lost the game! 😕\n The correct word is: ${selectedWord}`;
    popup.style.display = "flex";
  }
}

// message for already entered letter or enetered non-letter symbol ![a-z]
function showMessage() {
  message.classList.add("show");

  setTimeout(() => {
    message.classList.remove("show");
  }, 2000);
}

let correctLetters = [];
let wrongLetters = [];
const handleKeyDown = (e,selectedWord) => {
  console.log(selectedWord);
  if (e.keyCode === 20) { // if caps lock key is keydown do something...
    if (e.getModifierState('CapsLock')) {
      capsLock.textContent = 'The caps lock key is turned on';
      notLetter.style.display = 'none';
      existLetter.style.display = 'none';
      capsLock.style.display = 'block';
      showMessage();
    } else {
      capsLock.textContent = 'The caps lock key is turned off';
      notLetter.style.display = 'none';
      existLetter.style.display = 'none';
      capsLock.style.display = 'block';
      showMessage();
    }

  } else {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key;

      if (selectedWord.indexOf(letter) >= 0) {
        if (correctLetters.indexOf(letter) === -1) {
          correctLetters.push(letter);

          displayWord(selectedWord);
        } else {
          notLetter.style.display = "none";
          capsLock.style.display = 'none';
          existLetter.style.display = "block";
          showMessage();
        }
      } else {
        if (wrongLetters.indexOf(letter) === -1) {
          wrongLetters.push(letter);

          updateWrongLetters();
        } else {
          notLetter.style.display = "none";
          capsLock.style.display = 'none';
          existLetter.style.display = "block";
          showMessage();
        }
      }
    } else {
      existLetter.style.display = "none";
      capsLock.style.display = "none";
      notLetter.style.display = "block";
      showMessage();
    }
  }
}

const handleGameStart = (state) => {
  let selectedWord = '';
  console.log(state);
  play();
  selectedWord = state.correctWord.value;
  // console.log(selectedWord);
  displayWord(selectedWord,[]);
  document.addEventListener('keydown', (e) => {
    handleKeyDown(e,selectedWord);
  });

  // redirect to "/singleplayer"
  // window.location.href = '/singleplayer';
}

const handleGameState = (state) => {
  const player1 = state.players[0];
  const player2 = state.players[1];

  if (player1.turn && !player2.turn) {

  }
}

const handleGameOver = () => {

}

socket.on('init', handleInit);
socket.on('gameRoomId', handleRoomId);
socket.on('unknownRoom', handleUnknownRomm);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('gameStart', handleGameStart);
socket.on('gameOver', handleGameOver);
socket.on('gameState', handleGameState);
