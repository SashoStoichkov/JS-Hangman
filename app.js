const readline = require('readline-sync')
const RandomWordGenerator = require('./RandomWordGenerator/index')
const handleGuess = require('./word-handler/handler')

let guessed = [];
let wordStatus = null;
const generator = new RandomWordGenerator();

async function randomWord() {
    let word = await generator.getRandomWord();
    return word;
}


async function play() {
    let correctWord = await randomWord();
    let gameContinue = handleGuess(correctWord, guessed, '');
    while (gameContinue) {
        const input = readline.question('Please enter one letter: ')
        gameContinue = handleGuess(correctWord, guessed, input)
    }
}

play();
