const db = require("../../data/dbconfig");

const playerLevelsModel = {
  async getAll() {
    const playerLevels = await db("player_levels");
    return playerLevels;
  },
};

export default playerLevelsModel;
