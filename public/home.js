const button1 = document.getElementById("singleplayer");
const button2 = document.getElementById("multiplayer");
const selectedWord  = document.getElementById('selectedWord');
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

await randomWord().then ((res) => selectedWord.innerText = res);

button1.addEventListener("click", () => {
  console.log("button was clicked");
  fetch("https://localhost:8080/singleplayer", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) =>
      res.ok ? res.json() : Promise.reject(new Error(res.statusText))
    )
    .catch((err) => {
      console.log(err);
    });
});

button2.addEventListener("click", () => {
  console.log("button was clicked");
  fetch("https://localhost:8080/multiplayer", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) =>
      res.ok ? res.json() : Promise.reject(new Error(res.statusText))
    )
    .catch((err) => {
      console.log(err);
    });
});
