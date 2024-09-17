const db = require("../../data/dbconfig");

const tournamentMatchRoundsModel = {
  async getAll() {
    const tournamentMatchRounds = await db("tournament_match_rounds");
    return tournamentMatchRounds;
  },
};

export default tournamentMatchRoundsModel;
