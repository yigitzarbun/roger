const db = require("../../data/dbconfig");

const playersModel = {
  async getAll() {
    const players = await db("players");
    return players;
  },
  async getPaginated(filter) {
    const playersPerPage = 4;
    const offset = (filter.currentPage - 1) * playersPerPage;

    const paginatedPlayers = await db
      .select(
        "players.player_id",
        "players.user_id",
        "players.image",
        "players.fname",
        "players.lname",
        "players.gender",
        "players.birth_year",
        "player_levels.player_level_name",
        "player_levels.player_level_id",
        "locations.location_name",
        "locations.location_id"
      )
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

    const count = await db("players")
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
      .andWhere("users.user_status_type_id", 1);

    const data = {
      players: paginatedPlayers,
      totalPages: Math.ceil(count.length / playersPerPage),
    };

    return data;
  },
  async getByFilter(filter) {
    const players = await db
      .select(
        "players.user_id",
        "players.player_id",
        "players.image",
        "players.fname",
        "players.lname"
      )
      .from("players")
      .where((builder) => {
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
  async getPlayerProfile(userId) {
    try {
      const playerDetails = await db
        .select(
          "players.image",
          "players.fname",
          "players.lname",
          "players.birth_year",
          "players.gender",
          "players.user_id",
          "players.card_expiry",
          "players.card_number",
          "players.cvc",
          "players.name_on_card",
          "players.player_id",
          "players.player_bio_description",
          "players.phone_number",
          "locations.*",
          "player_levels.*",
          "users.email",
          "users.user_status_type_id",
          db.raw(
            "AVG(CASE WHEN event_reviews.is_active = true THEN event_reviews.review_score ELSE NULL END) as averageReviewScore"
          ),
          db.raw(
            "COUNT(DISTINCT CASE WHEN event_reviews.is_active = true THEN event_reviews.event_review_id ELSE NULL END) as reviewScoreCount"
          ),
          db.raw("COUNT(DISTINCT match_scores.match_score_id) as totalMatches"),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id = players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 1 ELSE 0 END) as wonMatches"
          ),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id != players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 1 ELSE 0 END) as lostMatches"
          ),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id = players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 3 ELSE 0 END) as playerPoints"
          )
        )
        .from("players")
        .leftJoin("users", "users.user_id", "=", "players.user_id")
        .leftJoin(
          "locations",
          "locations.location_id",
          "=",
          "players.location_id"
        )
        .leftJoin(
          "player_levels",
          "player_levels.player_level_id",
          "=",
          "players.player_level_id"
        )
        .leftJoin(
          "event_reviews",
          "event_reviews.reviewee_id",
          "=",
          "players.user_id"
        )
        .leftJoin("bookings", function () {
          this.on(function () {
            this.on("bookings.inviter_id", "=", "players.user_id").orOn(
              "bookings.invitee_id",
              "=",
              "players.user_id"
            );
          });
        })
        .leftJoin(
          "match_scores",
          "match_scores.booking_id",
          "=",
          "bookings.booking_id"
        )
        .where("players.user_id", userId)
        .andWhere((builder) => {
          builder
            .where("bookings.event_type_id", "=", 2)
            .orWhere("bookings.event_type_id", "=", 7);
        })
        .groupBy(
          "players.player_id",
          "users.user_id",
          "locations.location_id",
          "player_levels.player_level_id"
        );

      return playerDetails.length > 0 ? playerDetails[0] : null;
    } catch (error) {
      console.log("Error fetching player profile info: ", error);
      throw error; // Optionally rethrow the error to handle it elsewhere
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
  async playerPaymentDetailsExist(userId) {
    try {
      const playerPaymentDetails = await db("players")
        .where("user_id", userId)
        .whereNotNull("name_on_card")
        .whereNotNull("card_number")
        .whereNotNull("cvc")
        .whereNotNull("card_expiry")
        .first();

      return !!playerPaymentDetails;
    } catch (error) {
      console.log("Error fetching club payment details: ", error);
      return false;
    }
  },
};

export default playersModel;
