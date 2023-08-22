const db = require("../../data/dbconfig");

const matchScoresModel = {
  async getAll() {
    const matchScores = await db("match_scores");
    return matchScores;
  },

  async getByFilter(filter) {
    const matchScore = await db("match_scores").where(filter).first();
    return matchScore;
  },

  async getById(match_score_id) {
    const matchScore = await db("match_scores").where(
      "match_score_id",
      match_score_id
    );
    return matchScore;
  },

  async add(matchScore) {
    const [newMatchScore] = await db("match_scores")
      .insert(matchScore)
      .returning("*");
    return newMatchScore;
  },

  async update(updates) {
    return await db("match_scores")
      .where("match_score_id", updates.match_score_id)
      .update(updates);
  },
};

export default matchScoresModel;
