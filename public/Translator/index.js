export class Translator {
  constructor() {
    this.url = "https://api-free.deepl.com/v2/translate";
    this.authKey = process.env.DEEPL_AUTH_KEY;
    this.contentType = "application/x-www-form-urlencoded";
  }

  async translate(text, targetLang) {
    try {
      const response = await axios.post(
        this.url,
        `text=${text}&target_lang=${targetLang}`,
        {
          headers: {
            Authorization: this.authKey,
            "Content-Type": this.contentType,
          },
        }
      );
      return response.data.translations[0].text;
    } catch (err) {
      console.log("(Translator) Something went wrong");
      throw err;
    }
  }
}
