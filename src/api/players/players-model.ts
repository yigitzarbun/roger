const db = require("../../data/dbconfig");

const playersModel = {
  async getAll() {
    const players = await db("players");
    return players;
  },

  async getByFilter(filter) {
    const players = await db("players").where((builder) => {
      if (filter.player_id) {
        builder.where("player_id", filter.player_id);
      }
      if (filter.user_id) {
        builder.where("user_id", filter.user_id);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return players;
  },

  async getByPlayerId(player_id) {
    const player = await db("players").where("player_id", player_id);
    return player;
  },

  async getByUserId(user_id) {
    const player = await db("players").where("user_id", user_id);
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
