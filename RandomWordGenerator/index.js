const axios = require("axios");

class RandomWordGenerator {
  constructor() {
    this.url = "https://random-word-api.herokuapp.com/word";
  }

  async getRandomWord() {
    const response = await axios.get(this.url);
    return response.data[0];
  }
}

module.exports = RandomWordGenerator;

// const generator = new RandomWordGenerator();
// generator.getRandomWord().then((word) => console.log(word));
