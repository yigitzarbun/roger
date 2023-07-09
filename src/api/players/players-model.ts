const db = require("../../data/dbconfig");

const playersModel = {
  async getAll() {
    const players = await db("players")
      .leftJoin("genders", "genders.gender_id", "players.gender_id")
      .leftJoin("levels", "levels.level_id", "players.level_id");
    return players;
  },

  async getByFilter(filter) {
    const player = await db("players").where(filter).first();
    return player;
  },

  async getById(player_id) {
    const player = await db("players").where("player_id", player_id);
    return player;
  },

  async add(player) {
    const [newPlayer] = await db("players").insert(player).returning("*");
    return newPlayer;
  },

  async update(updates) {
    return await db("players")
      .where("player_id", updates.player_id)
      .update(updates);
  },
};

export default playersModel;
