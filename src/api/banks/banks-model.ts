const db = require("../../data/dbconfig");

const banksModel = {
  async getAll() {
    const banks = await db("banks");
    return banks;
  },
};

export default banksModel;
