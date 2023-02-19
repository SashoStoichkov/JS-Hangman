// import { RandomWordGenerator } from "./RandomWordGenerator";
// const generator = new RandomWordGenerator();
// // const translator = new Translator();

// //generate random word
// async function randomWord() {
//   let word = await generator.getRandomWord();
//   return word;
//   // let translatedWord = await translator.translate(word, "en");
//   // return translatedWord;
// }


 const initGame =  (selectedWord) => {
    const state  = createGameState();
    state.correctWord.value = selectedWord;
    return state;
}

const createGameState = () => {
    return {
        players: [{
            id:1,
            correctLetters: [],
            wrongLetters: [],
            correctWord:{
                value: ' ',
                found: false
            },
            turn:true

        },
        {
            id:2,
            correctLetters: [],
            wrongLetters: [],
            correctWord:{
                value: ' ',
                found: false
            },
            turn:false
        }
        ],
        correctWord: {
            value:'',
            found:false
        }
    }
}

const gameLoop = (state) => {
    
}

module.exports = {
    initGame
}