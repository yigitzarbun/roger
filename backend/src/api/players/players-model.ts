const db = require("../../data/dbconfig");

const playersModel = {
  async getAll() {
    const players = await db("players");
    return players;
  },
  async getPaginated(filter) {
    try {
      const playersPerPage = 4;
      const offset = (filter.currentPage - 1) * playersPerPage;

      const allPlayers = await db
        .select(
          "players.player_id",
          "players.user_id",
          "players.image",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "players.player_level_id",
          "locations.location_id",
          "player_levels.player_level_name",
          "locations.location_name"
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
        .where("users.user_status_type_id", 1)
        .andWhere((builder) => {
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
        });

      const playersWithScores = allPlayers.map((player) => {
        let proximityScore: number = 0;
        proximityScore = getProximityScore(
          player.location_id,
          filter.proximityLocationId
        );

        let levelScore: number = 0;

        if (filter.logicLevelId > 0) {
          levelScore =
            Number(player.player_level_id) === Number(filter.logicLevelId)
              ? 2
              : 0;
        }

        let ageScore: number = 0;

        if (filter.minAgeYear > 0 && filter.maxAgeYear > 0) {
          ageScore =
            Number(player.birth_year) >= Number(filter.minAgeYear) &&
            Number(player.birth_year) <= Number(filter.maxAgeYear)
              ? 1
              : 0;
        }

        const relevance_score: number = proximityScore + levelScore + ageScore;

        return {
          ...player,
          relevance_score: relevance_score,
        };
      });

      playersWithScores.sort((a, b) => {
        if (filter.column !== "") {
          if (filter.column === "lname") {
            // String comparison for lname
            if (filter.direction === "desc") {
              return b.lname.localeCompare(a.lname);
            } else {
              return a.lname.localeCompare(b.lname);
            }
          } else {
            // Numeric comparison for other columns
            if (filter.direction === "desc") {
              return b[filter.column] - a[filter.column];
            } else {
              return a[filter.column] - b[filter.column];
            }
          }
        }
        if (b.relevance_score !== a.relevance_score) {
          return b.relevance_score - a.relevance_score;
        }
        return a.player_id - b.player_id;
      });

      const paginatedPlayers = playersWithScores.slice(
        offset,
        offset + playersPerPage
      );

      const totalPages = Math.ceil(playersWithScores.length / playersPerPage);

      const data = {
        players: paginatedPlayers,
        totalPages: totalPages,
      };

      return data;
    } catch (error) {
      console.log("Error fetching paginated players: ", error);
    }
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
  async getPlayerProfile(userId: number) {
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
            "COALESCE(AVG(CASE WHEN event_reviews.is_active = true THEN event_reviews.review_score ELSE NULL END), 0) as averageReviewScore"
          ),
          db.raw(
            "COALESCE(COUNT(DISTINCT CASE WHEN event_reviews.is_active = true THEN event_reviews.event_review_id ELSE NULL END), 0) as reviewScoreCount"
          ),
          db.raw(
            "COALESCE(COUNT(DISTINCT match_scores.match_score_id), 0) as totalMatches"
          ),
          db.raw(
            "COALESCE(SUM(CASE WHEN match_scores.winner_id = players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 1 ELSE 0 END), 0) as wonMatches"
          ),
          db.raw(
            "COALESCE(SUM(CASE WHEN match_scores.winner_id != players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 1 ELSE 0 END), 0) as lostMatches"
          ),
          db.raw(
            "COALESCE(SUM(CASE WHEN match_scores.winner_id = players.user_id AND (match_scores.match_score_status_type_id = 3 OR match_scores.match_score_status_type_id = 7) THEN 3 ELSE 0 END), 0) as playerPoints"
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
        .leftJoin("event_reviews", function () {
          this.on("event_reviews.reviewee_id", "=", "players.user_id").andOn(
            "event_reviews.is_active",
            "=",
            db.raw("true")
          );
        })
        .leftJoin("bookings", function () {
          this.on(function () {
            this.on("bookings.inviter_id", "=", "players.user_id").orOn(
              "bookings.invitee_id",
              "=",
              "players.user_id"
            );
          }).andOn(function () {
            this.on("bookings.event_type_id", "=", 2).orOn(
              "bookings.event_type_id",
              "=",
              7
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
        .groupBy(
          "players.player_id",
          "users.user_id",
          "locations.location_id",
          "player_levels.player_level_id"
        );

      const result = await playerDetails;

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.log("Error fetching player profile info: ", error);
      throw error;
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

function getProximityScore(playerLocationId, filterProximityLocationId) {
  const locationProximityMap = {
    1: [8, 10, 11, 12],
    2: [7, 8, 11],
    3: [4, 6, 9, 17],
    4: [3, 6, 8, 9],
    5: [7, 8, 13, 14, 15, 16],
    6: [3, 4, 9, 13, 14],
    7: [5, 8, 10],
    8: [1, 2, 4, 10, 11, 16],
    9: [4, 6, 13, 14],
    10: [1, 2, 8, 11, 12],
    11: [1, 2, 8, 10, 12],
    12: [1, 2, 8, 10, 11],
    13: [3, 4, 9, 14, 17],
    14: [3, 4, 6, 9, 13, 17],
    15: [5, 7, 8, 10, 11, 12, 16],
    16: [2, 5, 7, 8, 15],
    17: [3, 4, 6, 9, 13, 14],
  };

  // Check if playerLocationId and filterProximityLocationId are the same
  if (Number(playerLocationId) === Number(filterProximityLocationId)) {
    return 3;
  }

  // Check if there's a proximity match in locationProximityMap
  const proximityList = locationProximityMap[filterProximityLocationId] || [];

  if (proximityList.includes(playerLocationId)) {
    return 1;
  } else {
    return 0;
  }
}

export default playersModel;
