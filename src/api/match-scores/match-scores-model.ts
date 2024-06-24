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
  async getPlayerMatchScoresWithBookingDetails(filter) {
    try {
      const scoresPerPage = 4;
      const offset = (filter.currentPage - 1) * scoresPerPage;
      const bookings = await db
        .select(
          "match_scores.*",
          "bookings.booking_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "bookings.event_date",
          "bookings.event_time",
          "players.image as playerImage",
          "players.fname",
          "players.lname",
          "player_levels.player_level_name",
          "event_types.*",
          "clubs.club_name",
          "courts.court_name",
          "court_surface_types.court_surface_type_name",
          "court_structure_types.court_structure_type_name"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("match_scores", function () {
          this.on("match_scores.booking_id", "=", "bookings.booking_id");
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "bookings.club_id");
        })
        .leftJoin("event_types", function () {
          this.on("event_types.event_type_id", "=", "bookings.event_type_id");
        })
        .leftJoin("court_surface_types", function () {
          this.on(
            "court_surface_types.court_surface_type_id",
            "=",
            "courts.court_surface_type_id"
          );
        })
        .leftJoin("court_structure_types", function () {
          this.on(
            "court_structure_types.court_structure_type_id",
            "=",
            "courts.court_structure_type_id"
          );
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .where((builder) => {
          if (filter.clubId > 0) {
            builder.where("clubs.user_id", filter.clubId);
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
          if (filter.courtSurfaceTypeId > 0) {
            builder.where(
              "court_surface_types.court_surface_type_id",
              filter.courtSurfaceTypeId
            );
          }
          if (filter.courtStructureTypeId > 0) {
            builder.where(
              "court_structure_types.court_structure_type_id",
              filter.courtStructureTypeId
            );
          }
          if (filter.eventTypeId > 0) {
            builder.where("event_types.event_type_id", filter.eventTypeId);
          }
          if (filter.missingScores > 0) {
            builder.where(function () {
              this.where("match_scores.match_score_status_type_id", 1).orWhere(
                function () {
                  this.where(
                    "match_scores.match_score_status_type_id",
                    2
                  ).andWhereNot("match_scores.reporter_id", filter.userId);
                }
              );
            });
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
        })
        .andWhere((builder) => {
          builder
            .where("bookings.event_type_id", 2)
            .orWhere("bookings.event_type_id", 7);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId);
        })
        .limit(scoresPerPage)
        .offset(offset);

      const count = await db
        .select(
          "match_scores.*",
          "bookings.*",
          "players.*",
          "players.image as playerImage",
          "clubs.*",
          "courts.*",
          "event_types.*",
          "court_surface_types.*",
          "court_structure_types.*",
          "player_levels.*"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("match_scores", function () {
          this.on("match_scores.booking_id", "=", "bookings.booking_id");
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "bookings.club_id");
        })
        .leftJoin("event_types", function () {
          this.on("event_types.event_type_id", "=", "bookings.event_type_id");
        })
        .leftJoin("court_surface_types", function () {
          this.on(
            "court_surface_types.court_surface_type_id",
            "=",
            "courts.court_surface_type_id"
          );
        })
        .leftJoin("court_structure_types", function () {
          this.on(
            "court_structure_types.court_structure_type_id",
            "=",
            "courts.court_structure_type_id"
          );
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .where((builder) => {
          if (filter.clubId > 0) {
            builder.where("clubs.user_id", filter.clubId);
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
          if (filter.courtSurfaceTypeId > 0) {
            builder.where(
              "court_surface_types.court_surface_type_id",
              filter.courtSurfaceTypeId
            );
          }
          if (filter.courtStructureTypeId > 0) {
            builder.where(
              "court_structure_types.court_structure_type_id",
              filter.courtStructureTypeId
            );
          }
          if (filter.eventTypeId > 0) {
            builder.where("event_types.event_type_id", filter.eventTypeId);
          }
          if (filter.missingScores > 0) {
            builder.where(function () {
              this.where("match_scores.match_score_status_type_id", 1).orWhere(
                function () {
                  this.where(
                    "match_scores.match_score_status_type_id",
                    2
                  ).andWhereNot("match_scores.reporter_id", filter.userId);
                }
              );
            });
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
        })
        .andWhere((builder) => {
          builder.where("bookings.event_type_id", 2);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId);
        });

      const data = {
        matchScores: bookings,
        totalPages: Math.ceil(count.length / scoresPerPage),
      };
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player match scores and bookings.");
    }
  },
  async getPlayerMissingMatchScoreNumbers(userId: number) {
    try {
      const missingScores = await db
        .select("match_scores.match_score_id", "bookings.booking_id")
        .from("match_scores")
        .leftJoin("bookings", function () {
          this.on("bookings.booking_id", "=", "match_scores.booking_id");
        })
        .where("bookings.booking_status_type_id", 5)
        .andWhere("bookings.event_type_id", 2)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId);
        })
        .andWhere((builder) => {
          builder
            .where("match_scores.match_score_status_type_id", 1)
            .orWhere((subBuilder) => {
              subBuilder
                .where("match_scores.match_score_status_type_id", 2)
                .andWhere("match_scores.reporter_id", "!=", userId);
            });
        });

      return missingScores;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player match scores and bookings.");
    }
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
