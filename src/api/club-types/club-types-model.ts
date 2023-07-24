const db = require("../../data/dbconfig");

const clubTypesModel = {
  async getAll() {
    const clubTypes = await db("club_types");
    return clubTypes;
  },
};

export default clubTypesModel;
