const db = require("../../data/dbconfig");

const matchScoresStatusTypesModel = {
  async getAll() {
    const matchScoresStatusTypes = await db("match_score_status_types");
    return matchScoresStatusTypes;
  },
};

export default matchScoresStatusTypesModel;
