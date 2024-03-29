import { RandomWordGenerator } from "./RandomWordGenerator/index.js";
// import { Translator } from "./Translator/index.js";

const generator = new RandomWordGenerator();
// const translator = new Translator();

//generate random word
async function randomWord() {
  let word = await generator.getRandomWord();
  return word;
  // let translatedWord = await translator.translate(word, "en");
  // return translatedWord;
}

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
const capsLock = document.getElementById('caps-lock');

let startTime = new Date();

let selectedWord = "";
const correctLetters = [];
const wrongLetters = [];

// display word --> status of the word --> if every letter is guessed the setelected word is displayed
function displayWord() {
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
    let endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    timeDiff /= 1000;

    // get seconds
    let seconds = Math.round(timeDiff);


    finalMessage.innerText = `Congratulations! You won! 😃\n Your time is: ${seconds} seconds`;
    popup.style.display = "flex";
  }
}

// wrong-letters conatiner --> every wrong guessed letter is displayed in the right side
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

window.addEventListener("keydown", (e) => {
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

          displayWord();
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
});

buttonPlayAgain.addEventListener("click", async () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);
  await randomWord()
    .then((res) => (selectedWord = res))
    .then(() => displayWord());

  updateWrongLetters(); // for deleting hangman svg
  wrongLettersContainer.style.display = "none";
  startTime = new Date();

  popup.style.display = "none";
});

// select word for the first game
await randomWord()
  .then((res) => (selectedWord = res))
  .then(() => displayWord());
