const db = require("../../data/dbconfig");

const userStatusTypesModel = {
  async getAll() {
    const userStatusTypes = await db("user_status_types");
    return userStatusTypes;
  },
};

export default userStatusTypesModel;
