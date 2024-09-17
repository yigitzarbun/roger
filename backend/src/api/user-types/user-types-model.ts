const db = require("../../data/dbconfig");

const userTypesModel = {
  async getAll() {
    const userTypes = await db("user_types");
    return userTypes;
  },
};

export default userTypesModel;
