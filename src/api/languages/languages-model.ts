const db = require("../../data/dbconfig");

const languagesModel = {
  async getAll() {
    const languages = await db("languages");
    return languages;
  },
};

export default languagesModel;
