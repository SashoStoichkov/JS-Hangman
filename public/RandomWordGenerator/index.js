export class RandomWordGenerator {
  constructor() {
    this.url = "https://random-word-api.herokuapp.com/word";
  }

  async getRandomWord() {
    try {
      const response = await axios.get(this.url);
      return response.data[0];
    } catch (err) {
      console.log("(WordGenerator) Something went wrong");
      throw err;
    }
  }
}
