const db = require("../../data/dbconfig");

const bookingsModel = {
  async getAll() {
    const bookings = await db("bookings");
    return bookings;
  },

  async getByFilter(filter) {
    const bookings = await db("bookings").where((builder) => {
      if (filter.booking_id) {
        builder.where("booking_id", filter.booking_id);
      }
      if (filter.event_date) {
        builder.where("event_date", filter.event_date);
      }
      if (filter.event_time) {
        builder.where("event_time", filter.event_time);
      }
      if (filter.booking_status_type_id) {
        builder.where("booking_status_type_id", filter.booking_status_type_id);
      }
      if (filter.event_type_id) {
        builder.where("event_type_id", filter.event_type_id);
      }
      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }
      if (filter.court_id) {
        builder.where("court_id", filter.court_id);
      }
      if (filter.inviter_id) {
        builder.where("inviter_id", filter.inviter_id);
      }
      if (filter.invitee_id) {
        builder.where("invitee_id", filter.invitee_id);
      }
      if (filter.user_id) {
        builder.andWhere(function () {
          this.where("bookings.inviter_id", filter.user_id)
            .orWhere("bookings.invitee_id", filter.user_id)
            .orWhereExists(function () {
              this.select(db.raw(1))
                .from("student_groups")
                .whereRaw("student_groups.first_student_id = ?", [
                  filter.user_id,
                ])
                .orWhereRaw("student_groups.second_student_id = ?", [
                  filter.user_id,
                ])
                .orWhereRaw("student_groups.third_student_id = ?", [
                  filter.user_id,
                ])
                .orWhereRaw("student_groups.fourth_student_id = ?", [
                  filter.user_id,
                ]);
            });
        });
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return bookings;
  },

  async getPlayerBookingsByUserId(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.*",
          "players.*",
          "trainers.*",
          "clubs.*",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "courts.*",
          "student_groups.*",
          "users.user_type_id",
          "users.user_id",
          "player_levels.*",
          "trainer_experience_types.*",
          "event_types.*",
          "payments.*"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.invitee_id").orOn(
            "trainers.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("student_groups", function () {
          this.on("student_groups.user_id", "=", "bookings.invitee_id");
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "bookings.club_id");
        })
        .leftJoin("users", function () {
          this.on(
            "users.user_id",
            "=",
            db.raw(
              "(CASE WHEN ? = bookings.inviter_id THEN bookings.invitee_id ELSE bookings.inviter_id END)",
              [userId]
            )
          );
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .leftJoin("event_types", function () {
          this.on("event_types.event_type_id", "=", "bookings.event_type_id");
        })
        .leftJoin("payments", function () {
          this.on("payments.payment_id", "=", "bookings.payment_id");
        })
        .where("bookings.booking_status_type_id", 2)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId)
            .orWhere("student_groups.first_student_id", userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", userId).orWhereNot(
            "trainers.user_id",
            userId
          );
        });

      return bookings;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },

  async getOutgoingPlayerRequests(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.*",
          "players.*",
          "trainers.*",
          "clubs.*",
          "clubs.image as clubImage",
          "courts.*"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.invitee_id").orOn(
            "trainers.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "bookings.club_id");
        })
        .where("bookings.booking_status_type_id", 1)
        .andWhere((builder) => {
          builder.where("bookings.inviter_id", userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", userId).orWhereNot(
            "trainers.user_id",
            userId
          );
        });

      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },

  async getIncomingPlayerRequests(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.*",
          "players.*",
          "trainers.*",
          "clubs.*",
          "clubs.image as clubImage",
          "courts.*"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.invitee_id").orOn(
            "trainers.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "bookings.club_id");
        })
        .where("bookings.booking_status_type_id", 1)
        .andWhere((builder) => {
          builder.where("bookings.invitee_id", userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", userId).orWhereNot(
            "trainers.user_id",
            userId
          );
        });

      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },

  async getPlayerPastEvents(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.*",
          "players.*",
          "trainers.*",
          "trainers.user_id as trainerUserId",
          "clubs.*",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "courts.*",
          "event_types.*",
          "court_surface_types.*",
          "court_structure_types.*",
          "student_groups.*",
          "users.*"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.invitee_id").orOn(
            "trainers.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("student_groups", function () {
          this.on("student_groups.user_id", "=", "bookings.invitee_id");
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
        .leftJoin("users", function () {
          this.on(
            "users.user_id",
            "=",
            db.raw(
              "(CASE WHEN ? = bookings.inviter_id THEN bookings.invitee_id ELSE bookings.inviter_id END)",
              [userId]
            )
          );
        })
        .where("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId)
            .orWhere("student_groups.first_student_id", userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", userId)
            .orWhereNot("trainers.user_id", userId)
            .orWhere("student_groups.first_student_id", userId);
        });

      return bookings;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },
  async getMensLeaderboard(gender: string) {
    try {
      const mensLeaderboard = await db
        .select(
          "players.user_id",
          "players.image",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.*",
          "locations.*",
          db.raw("COUNT(match_scores.match_score_id) as totalMatches"),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id = players.user_id THEN 1 ELSE 0 END) as wonMatches"
          ),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id != players.user_id THEN 1 ELSE 0 END) as lostMatches"
          ),
          db.raw(
            "SUM(CASE WHEN match_scores.winner_id = players.user_id THEN 3 ELSE 0 END) as playerPoints"
          )
        )
        .from("players")
        .leftJoin(
          "player_levels",
          "player_levels.player_level_id",
          "=",
          "players.player_level_id"
        )
        .leftJoin(
          "locations",
          "locations.location_id",
          "=",
          "players.location_id"
        )
        .leftJoin("bookings", function () {
          this.on("players.user_id", "=", "bookings.inviter_id").orOn(
            "players.user_id",
            "=",
            "bookings.invitee_id"
          );
        })
        .leftJoin(
          "match_scores",
          "match_scores.booking_id",
          "=",
          "bookings.booking_id"
        )
        .where("bookings.event_type_id", 2)
        .andWhere("match_scores.match_score_status_type_id", 3)
        .andWhere("players.gender", gender)
        .groupBy(
          "players.user_id",
          "players.image",
          "players.player_id",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_id",
          "locations.location_id"
        )
        .orderByRaw(
          "SUM(CASE WHEN match_scores.winner_id = players.user_id THEN 1 ELSE 0 END) DESC"
        );

      return mensLeaderboard;
    } catch (error) {
      console.log("Error fetching men's leaderboard", error);
      throw error;
    }
  },
  async getById(booking_id: number) {
    try {
      const booking = await db("bookings").where("booking_id", booking_id);
      return booking;
    } catch (error) {
      console.log(error);
    }
  },

  async add(booking) {
    const [newBooking] = await db("bookings").insert(booking).returning("*");
    return newBooking;
  },

  async update(updates) {
    return await db("bookings")
      .where("booking_id", updates.booking_id)
      .update(updates);
  },
};

export default bookingsModel;
