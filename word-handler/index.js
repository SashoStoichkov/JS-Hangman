const maxWrong = 10;
let playerMistakes = 0;

function isGameWon(wordStatus, correctWord) {
    if (wordStatus === correctWord) {
        console.log("You win the game!")
        return true;
    }
    return false;
}

function isGameLost() {
    if (playerMistakes === maxWrong) {
        console.log("You doesn't have more lifes.");
        return true;
    }
    return false;
}

function guessedWord(word, guessed) {
    let wordStatus = word.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : "_")).join('');
    console.log(wordStatus)
    return wordStatus;
}


function handleGuess(word, guessed, choosenLetter) {
    guessed.indexOf(choosenLetter) === -1 ? guessed.push(choosenLetter) : null;
    if (word.indexOf(choosenLetter) >= 0) {
        let wordStatus = guessedWord(word, guessed);
        if (isGameWon(wordStatus, word)) {
            return false; //the game not continue
        }
        return true;
    };

    if (word.indexOf(choosenLetter) === -1) {
        playerMistakes++;
        if (isGameLost()) {
            return false; //the game not continue
        }
        return true;
    };
}

module.exports = handleGuess
