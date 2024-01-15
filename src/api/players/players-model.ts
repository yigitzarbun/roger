const db = require("../../data/dbconfig");

const playersModel = {
  async getAll() {
    const players = await db("players");
    return players;
  },

  async getPaginated(filter) {
    const playersPerPage = 4;
    const offset = (filter.currentPage - 1) * playersPerPage;

    const paginatedPlayers = await db("players")
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "players.user_id");
      })
      .leftJoin("locations", function () {
        this.on("locations.location_id", "=", "players.location_id");
      })
      .leftJoin("player_levels", function () {
        this.on(
          "player_levels.player_level_id",
          "=",
          "players.player_level_id"
        );
      })
      .where((builder) => {
        if (filter.playerLevelId > 0) {
          builder.where("players.player_level_id", filter.playerLevelId);
        }
        if (filter.selectedGender !== "") {
          builder.where("players.gender", filter.selectedGender);
        }
        if (filter.locationId > 0) {
          builder.where("players.location_id", filter.locationId);
        }
        if (filter.currentUserId) {
          builder.where("players.user_id", "!=", filter.currentUserId);
        }
        if (filter.textSearch && filter.textSearch !== "") {
          builder.where(function () {
            this.where(
              "players.fname",
              "ilike",
              `%${filter.textSearch}%`
            ).orWhere("players.lname", "ilike", `%${filter.textSearch}%`);
          });
        }
      })
      .andWhere("users.user_status_type_id", 1)
      .orderBy("players.player_id", "asc")
      .limit(playersPerPage)
      .offset(offset);

    const data = {
      players: paginatedPlayers,
      totalPages: Math.ceil(paginatedPlayers.length / playersPerPage),
    };
    return data;
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

  async getPlayerProfile(userId: number) {
    try {
      const playerDetails = await db
        .select("players.*", "users.*", "locations.*", "player_levels.*")
        .from("players")
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "players.user_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .where("players.user_id", userId);
      return playerDetails;
    } catch (error) {
      console.log("Error fetching player profile info: ", error);
    }
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
