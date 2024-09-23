const db = require("../../data/dbconfig");

const bookingsModel = {
  async getAll() {
    const bookings = await db("bookings");
    return bookings;
  },
  async getByFilter(filter) {
    const bookings = await db
      .select(
        "bookings.event_date",
        "bookings.event_time",
        "bookings.court_id",
        "bookings.booking_status_type_id"
      )
      .from("bookings")
      .where((builder) => {
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
          builder.where(
            "booking_status_type_id",
            filter.booking_status_type_id
          );
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
  async getPlayerCalendarBookingsByFilter(filter) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "bookings.booking_status_type_id",
          "bookings.event_type_id",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "players.image as playerImage",
          "trainers.image as trainerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "trainers.fname",
          "trainers.lname",
          "student_groups.student_group_name",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "trainer_experience_types.trainer_experience_type_name",
          "trainer_experience_types.trainer_experience_type_id",
          "players.gender as playerGender",
          "trainers.gender",
          "players.birth_year as playerBirthYear",
          "trainers.birth_year",
          "event_types.event_type_name",
          "event_types.event_type_id",
          "bookings.event_date",
          "bookings.event_time",
          "courts.court_name",
          "clubs.club_name",
          "payments.payment_amount",
          "payments.lesson_price",
          "payments.court_price",
          "bookings.registered_at",
          "bookings.invitation_note",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "users.user_type_id",
          "users.user_id"
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
              [filter.userId]
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
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId)
            .orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
        })
        .andWhere(function () {
          if (filter.date != "") {
            this.where("bookings.event_date", "=", filter.date);
          }
          if (filter.eventTypeId > 0) {
            this.where("bookings.event_type_id", "=", filter.eventTypeId);
          }
          if (filter.clubId > 0) {
            this.where("bookings.club_id", "=", filter.clubId);
          }
          if (filter.textSearch && filter.textSearch !== "") {
            this.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
            });
          }
        })
        .orderBy("bookings.event_date", "desc");

      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player calendar bookings.");
    }
  },
  async getTrainerCalendarBookingsByFilter(filter) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "bookings.booking_status_type_id",
          "bookings.event_type_id",
          "players.image as playerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.user_id as playerUserId",
          "players.gender as playerGender",
          "players.birth_year as playerBirthYear",
          "club_external_members.fname as externalFname",
          "club_external_members.lname as externalLname",
          "club_external_members.user_id as externalUserId",
          "club_external_members.gender as externalGender",
          "trainers.image as trainerImage",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "student_groups.student_group_name",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "event_types.event_type_name",
          "bookings.event_time",
          "bookings.event_date",
          "clubs.club_name",
          "courts.court_name",
          "payments.lesson_price",
          "payments.court_price",
          "payments.payment_amount"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id").orOn(
            "players.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin("club_external_members", function () {
          this.on(
            "club_external_members.user_id",
            "=",
            "bookings.invitee_id"
          ).orOn("club_external_members.user_id", "=", "bookings.inviter_id");
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
              [filter.userId]
            )
          );
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          ).orOn(
            "player_levels.player_level_id",
            "=",
            "club_external_members.player_level_id"
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
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
        })
        /*
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
        })
        */
        .andWhere(function () {
          if (filter.date != "") {
            this.where("bookings.event_date", "=", filter.date);
          }
          if (filter.eventTypeId > 0) {
            this.where("bookings.event_type_id", "=", filter.eventTypeId);
          }
          if (filter.clubId > 0) {
            this.where("bookings.club_id", "=", filter.clubId);
          }
          if (filter.textSearch && filter.textSearch !== "") {
            this.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere(
                  "club_external_members.fname",
                  "ilike",
                  `%${filter.textSearch}%`
                )
                .orWhere(
                  "club_external_members.lname",
                  "ilike",
                  `%${filter.textSearch}%`
                );
            });
          }
        });

      return bookings;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch trainer bookings.");
    }
  },
  async getOutgoingPlayerRequests(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "bookings.booking_status_type_id",
          "bookings.event_date",
          "bookings.event_time",
          "bookings.invitee_id",
          "bookings.inviter_id",
          "bookings.event_type_id",
          "users.user_type_id",
          "players.image as playerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.gender",
          "players.birth_year",
          "trainers.birth_year",
          "trainers.image as trainerImage",
          "trainers.fname",
          "trainers.lname",
          "trainers.gender",
          "clubs.image as clubImage",
          "clubs.club_name",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "trainer_experience_types.trainer_experience_type_name",
          "trainer_experience_types.trainer_experience_type_id",
          "courts.court_name",
          "payments.payment_amount",
          "payments.court_price",
          "payments.lesson_price",
          "event_types.event_type_name"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id");
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.invitee_id");
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "bookings.invitee_id");
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .leftJoin("payments", function () {
          this.on("payments.payment_id", "=", "bookings.payment_id");
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
          "players.fname as playerFname",
          "players.lname as playerLname",
          "trainers.fname",
          "trainers.lname",
          "event_types.event_type_name",
          "event_types.event_type_id",
          "bookings.event_type_id",
          "bookings.booking_id",
          "bookings.booking_status_type_id",
          "users.user_type_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "players.image as playerImage",
          "trainers.image as trainerImage",
          "clubs.image as clubImage",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "trainer_experience_types.trainer_experience_type_name",
          "trainer_experience_types.trainer_experience_type_id",
          "players.gender",
          "trainers.gender",
          "players.birth_year",
          "trainers.birth_year",
          "bookings.event_date",
          "bookings.event_time",
          "courts.court_name",
          "clubs.club_name",
          "payments.payment_amount",
          "payments.court_price",
          "payments.lesson_price",
          "bookings.invitation_note",
          "payments.payment_id",
          "payments.payment_status",
          "courts.court_id",
          "clubs.club_id"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.inviter_id");
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "bookings.inviter_id");
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "bookings.inviter_id");
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .leftJoin("payments", function () {
          this.on("payments.payment_id", "=", "bookings.payment_id");
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
  async getPlayerPastEvents(filter) {
    try {
      const eventsPerPage = 4;
      const offset = (filter.currentPage - 1) * eventsPerPage;
      const bookings = await db
        .distinct("bookings.booking_id")
        .select(
          "bookings.booking_id",
          "bookings.event_type_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "players.image as playerImage",
          "trainers.image as trainerImage",
          "trainers.user_id as trainerUserId",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "event_reviews.is_active as isEventReviewActive",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "trainers.fname",
          "trainers.lname",
          "student_groups.student_group_name",
          "bookings.event_date",
          "bookings.event_time",
          "clubs.club_name",
          "courts.court_name",
          "court_structure_types.court_structure_type_name",
          "court_structure_types.court_structure_type_id",
          "court_surface_types.court_surface_type_name",
          "court_surface_types.court_surface_type_id",
          "event_types.event_type_name"
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
              [filter.userId]
            )
          );
        })
        .leftJoin("event_reviews", function () {
          this.on("event_reviews.booking_id", "=", "bookings.booking_id");
        })

        .where((builder) => {
          if (filter.clubId > 0) {
            builder.where("clubs.user_id", filter.clubId);
          }
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
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
          if (filter.missingReviews > 0) {
            builder.where("event_reviews.is_active", false);
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere("event_reviews.reviewer_id", "=", filter.userId)
        .orderBy("bookings.event_date", "desc")
        .limit(eventsPerPage)
        .offset(offset);

      const count = await db
        .distinct("bookings.booking_id")
        .select(
          "bookings.booking_id",
          "bookings.event_type_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "players.image as playerImage",
          "trainers.image as trainerImage",
          "trainers.user_id as trainerUserId",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "event_reviews.is_active as isEventReviewActive",
          "players.fname",
          "players.lname",
          "trainers.fname",
          "trainers.lname",
          "student_groups.student_group_name",
          "bookings.event_date",
          "bookings.event_time",
          "clubs.club_name",
          "courts.court_name",
          "court_structure_types.court_structure_type_name",
          "court_surface_types.court_surface_type_name",
          "event_types.event_type_name"
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
              [filter.userId]
            )
          );
        })
        .leftJoin("event_reviews", function () {
          this.on("event_reviews.booking_id", "=", "bookings.booking_id");
        })

        .where((builder) => {
          if (filter.clubId > 0) {
            builder.where("clubs.user_id", filter.clubId);
          }
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
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
          if (filter.missingReviews > 0) {
            builder.where("event_reviews.is_active", false);
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere("event_reviews.reviewer_id", "=", filter.userId);

      const data = {
        pastEvents: bookings,
        totalPages: Math.ceil(count.length / eventsPerPage),
      };
      return data;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },
  async getTrainerPastEvents(filter) {
    try {
      const eventsPerPage = 4;
      const offset = (filter.currentPage - 1) * eventsPerPage;
      const bookings = await db
        .distinct("bookings.booking_id")
        .select(
          "bookings.booking_id",
          "bookings.event_type_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "players.image as playerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.user_id as playerUserId",
          "trainers.image as trainerImage",
          "trainers.user_id as trainerUserId",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "event_reviews.is_active as isEventReviewActive",
          "student_groups.student_group_name",
          "bookings.event_date",
          "bookings.event_time",
          "event_types.event_type_name",
          "court_surface_types.court_surface_type_name",
          "court_surface_types.court_surface_type_id",
          "court_structure_types.court_structure_type_name",
          "court_structure_types.court_structure_type_id",
          "courts.court_name",
          "clubs.club_name"
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
              [filter.userId]
            )
          );
        })
        .leftJoin("event_reviews", function () {
          this.on("event_reviews.booking_id", "=", "bookings.booking_id");
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
          if (filter.missingReviews > 0) {
            builder.where("event_reviews.is_active", false);
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere("event_reviews.reviewer_id", "=", filter.userId)
        .limit(eventsPerPage)
        .offset(offset);

      const count = await db
        .distinct("bookings.booking_id")
        .select(
          "bookings.booking_id",
          "bookings.event_type_id",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "players.image as playerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.user_id as playerUserId",
          "trainers.image as trainerImage",
          "trainers.user_id as trainerUserId",
          "clubs.user_id as clubUserId",
          "clubs.image as clubImage",
          "event_reviews.is_active as isEventReviewActive",
          "student_groups.student_group_name",
          "bookings.event_date",
          "bookings.event_time",
          "event_types.event_type_name",
          "court_surface_types.court_surface_type_name",
          "court_structure_types.court_structure_type_name",
          "courts.court_name",
          "clubs.club_name"
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
              [filter.userId]
            )
          );
        })
        .leftJoin("event_reviews", function () {
          this.on("event_reviews.booking_id", "=", "bookings.booking_id");
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
          if (filter.missingReviews > 0) {
            builder.where("event_reviews.is_active", false);
          }
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", filter.userId)
            .orWhere("bookings.inviter_id", filter.userId);
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", filter.userId).orWhereNot(
            "trainers.user_id",
            filter.userId
          );
          //.orWhere("student_groups.first_student_id", filter.userId);
        })
        .andWhere("event_reviews.reviewer_id", "=", filter.userId);

      const data = {
        pastEvents: bookings,
        totalPages: Math.ceil(count.length / eventsPerPage),
      };
      return data;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch trainer past bookings.");
    }
  },
  async getOutgoingTrainerRequests(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "bookings.booking_status_type_id",
          "bookings.event_type_id",
          "bookings.invitee_id",
          "bookings.inviter_id",
          "players.image as playerImage",
          "clubs.image as clubImage",
          "players.fname",
          "players.lname",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "bookings.event_date",
          "bookings.event_time",
          "courts.court_name",
          "clubs.club_name",
          "payments.lesson_price"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.invitee_id");
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("payments", function () {
          this.on("payments.payment_id", "=", "bookings.payment_id");
        })
        .where("bookings.booking_status_type_id", 1)
        .andWhere((builder) => {
          builder.where("bookings.inviter_id", userId);
        });
      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch trainer outgoing bookings.");
    }
  },
  async getIncomingTrainerRequests(userId: number) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "event_types.event_type_name",
          "event_types.event_type_id",
          "players.image as playerImage",
          "clubs.image as clubImage",
          "bookings.event_date",
          "bookings.event_time",
          "payments.court_price",
          "payments.lesson_price",
          "bookings.event_type_id",
          "payments.payment_id",
          "clubs.club_id",
          "clubs.club_name",
          "courts.court_id",
          "courts.court_name",
          "bookings.inviter_id",
          "bookings.invitee_id",
          "bookings.invitation_note",
          "bookings.booking_status_type_id",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "users.user_type_id"
        )
        .from("bookings")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "bookings.inviter_id");
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "bookings.inviter_id");
        })
        .leftJoin("payments", function () {
          this.on("payments.payment_id", "=", "bookings.payment_id");
        })
        .where("bookings.booking_status_type_id", 1)
        .andWhere((builder) => {
          builder.where("bookings.invitee_id", userId);
        });

      return bookings;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player bookings.");
    }
  },
  async getUserProfilePastEvents(userId: number) {
    try {
      const userPastEvents = await db
        .select(
          "bookings.booking_id",
          "bookings.event_type_id",
          "bookings.invitee_id",
          "bookings.inviter_id",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.user_id as playerUserId",
          "players.image as playerImage",
          "trainers.fname as trainerFname",
          "trainers.lname as trainerLname",
          "trainers.user_id as trainerUserId",
          "trainers.image as trainerImage",
          "players.fname",
          "players.lname",
          "trainers.fname",
          "trainers.lname",
          "clubs.club_name",
          "clubs.user_id as clubUserId",
          "event_types.event_type_name",
          "bookings.event_date",
          "bookings.event_time",
          "match_scores.match_score_status_type_id",
          "match_scores.inviter_first_set_games_won",
          "match_scores.invitee_first_set_games_won",
          "match_scores.inviter_second_set_games_won",
          "match_scores.invitee_second_set_games_won",
          "match_scores.inviter_third_set_games_won",
          "match_scores.inviter_third_set_games_won",
          "match_scores.invitee_third_set_games_won",
          "match_scores.invitee_third_set_games_won",
          "match_scores.winner_id",
          "courts.court_name",
          "student_groups.student_group_name",
          db.raw(
            "CASE WHEN event_types.event_type_id = 2 AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id = players.user_id THEN players.fname END as winner_fname"
          ),
          db.raw(
            "CASE WHEN event_types.event_type_id = 2 AND match_scores.match_score_status_type_id = 3 AND match_scores.winner_id = players.user_id THEN players.lname END as winner_lname"
          )
        )
        .from("bookings")
        .leftJoin("courts", "courts.court_id", "=", "bookings.court_id")
        .leftJoin("clubs", "clubs.club_id", "=", "bookings.club_id")
        .leftJoin(
          "locations",
          "locations.location_id",
          "=",
          "clubs.location_id"
        )
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
          this.on("student_groups.user_id", "=", "bookings.invitee_id").orOn(
            "student_groups.user_id",
            "=",
            "bookings.inviter_id"
          );
        })
        .leftJoin(
          "event_types",
          "event_types.event_type_id",
          "=",
          "bookings.event_type_id"
        )
        .leftJoin(
          "match_scores",
          "match_scores.booking_id",
          "=",
          "bookings.booking_id"
        )
        .where("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId);
        })

        .andWhere((builder) => {
          builder
            .whereNot("players.user_id", userId)
            .orWhereNot("trainers.user_id", userId);
        });

      return userPastEvents;
    } catch (error) {
      console.log("Error fetching user past events: ", error);
    }
  },
  async getPlayersLeaderboard(filter) {
    try {
      const playersPerPage = filter.perPage;
      const currentPage = filter.currentPageNumber || 1;
      const offset = (currentPage - 1) * playersPerPage;
      const playersLeaderboard = await db
        .select(
          "players.user_id",
          "players.image",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "locations.location_name",
          "users.user_status_type_id",
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
        .leftJoin("users", "users.user_id", "players.user_id")
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
        .where((builder) => {
          if (filter.playerLevelId > 0) {
            builder.where("players.player_level_id", filter.playerLevelId);
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
          if (filter.locationId > 0) {
            builder.where("players.location_id", filter.locationId);
          }
        })
        .andWhere((builder) =>
          builder
            .where("bookings.event_type_id", 2)
            .orWhere("bookings.event_type_id", 7)
        )
        .andWhere("users.user_status_type_id", 1)
        .andWhere("match_scores.match_score_status_type_id", 3)
        .andWhere("players.gender", filter.gender)
        .groupBy(
          "players.user_id",
          "players.image",
          "players.player_id",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_id",
          "locations.location_id",
          "users.user_status_type_id"
        )
        .orderByRaw(
          "SUM(CASE WHEN match_scores.winner_id = players.user_id THEN 1 ELSE 0 END) DESC"
        )
        .limit(playersPerPage)
        .offset(offset);

      const count = await db
        .select(
          "players.user_id",
          "players.image",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_name",
          "locations.location_name",
          "users.user_status_type_id",
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
        .leftJoin("users", "users.user_id", "players.user_id")
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
        .where((builder) => {
          if (filter.playerLevelId > 0) {
            builder.where("players.player_level_id", filter.playerLevelId);
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
          if (filter.locationId > 0) {
            builder.where("players.location_id", filter.locationId);
          }
        })
        .andWhere("bookings.event_type_id", 2)
        .andWhere("match_scores.match_score_status_type_id", 3)
        .andWhere("users.user_status_type_id", 1)
        .andWhere("players.gender", filter.gender)
        .groupBy(
          "players.user_id",
          "players.image",
          "players.player_id",
          "players.fname",
          "players.lname",
          "players.gender",
          "players.birth_year",
          "player_levels.player_level_id",
          "locations.location_id",
          "users.user_status_type_id"
        )
        .orderByRaw(
          "SUM(CASE WHEN match_scores.winner_id = players.user_id THEN 1 ELSE 0 END) DESC"
        );

      const data = {
        leaderboard: playersLeaderboard,
        totalPages: Math.ceil(count.length / playersPerPage),
      };
      return data;
    } catch (error) {
      console.log("Error fetching player's leaderboard", error);
      throw error;
    }
  },
  async getBookedCourtHours(filter) {
    try {
      const bookings = await db
        .select(
          "bookings.booking_id",
          "bookings.event_time",
          "bookings.event_date",
          "bookings.court_id",
          "bookings.booking_status_type_id"
        )
        .from("bookings")
        .where("court_id", filter.courtId)
        .andWhere("event_date", filter.eventDate)
        .andWhere((builder) =>
          builder
            .where("booking_status_type_id", 1)
            .orWhere("booking_status_type_id", 2)
        );

      return bookings;
    } catch (error) {
      console.log("Error fetching booked court hours: ", error);
    }
  },
  async getPaginatedClubCalendarBookings(filter) {
    const bookingsPerPage = 4;
    const offset = (filter.currentPage - 1) * bookingsPerPage;

    const paginatedBookings = await db
      .select(
        db.raw("DISTINCT ON (bookings.booking_id) bookings.*"),
        db.raw(
          "(SELECT CONCAT(COALESCE(inviter.fname, trainers.fname, club_external_members.fname, student_groups.student_group_name), ' ', COALESCE(inviter.lname, trainers.lname, club_external_members.lname, '')) FROM (VALUES (bookings.inviter_id)) AS t(user_id) LEFT JOIN players AS inviter ON inviter.user_id = t.user_id LEFT JOIN trainers ON trainers.user_id = t.user_id LEFT JOIN club_external_members ON club_external_members.user_id = t.user_id LEFT JOIN student_groups ON student_groups.user_id = t.user_id LIMIT 1) AS inviterName"
        ),
        db.raw(
          "(SELECT CONCAT(COALESCE(invitee.fname, trainers.fname, club_external_members.fname, student_groups.student_group_name), ' ', COALESCE(invitee.lname, trainers.lname, club_external_members.lname, '')) FROM (VALUES (bookings.invitee_id)) AS t(user_id) LEFT JOIN players AS invitee ON invitee.user_id = t.user_id LEFT JOIN trainers ON trainers.user_id = t.user_id LEFT JOIN club_external_members ON club_external_members.user_id = t.user_id LEFT JOIN student_groups ON student_groups.user_id = t.user_id LIMIT 1) AS inviteeName"
        ),
        "clubs.*",
        "event_types.*",
        "courts.*"
      )
      .from("bookings")
      .leftJoin("clubs", "clubs.club_id", "=", "bookings.club_id")
      .leftJoin(
        "event_types",
        "event_types.event_type_id",
        "=",
        "bookings.event_type_id"
      )
      .leftJoin("players", function () {
        this.on("players.user_id", "=", "bookings.inviter_id").orOn(
          "players.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "bookings.inviter_id").orOn(
          "trainers.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .leftJoin("club_external_members", function () {
        this.on(
          "club_external_members.user_id",
          "=",
          "bookings.inviter_id"
        ).orOn("club_external_members.user_id", "=", "bookings.invitee_id");
      })
      .leftJoin("student_groups", function () {
        this.on("student_groups.user_id", "=", "bookings.inviter_id").orOn(
          "student_groups.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .leftJoin("courts", "courts.court_id", "=", "bookings.court_id")
      .where((builder) => {
        if (filter.textSearch !== "") {
          builder.where(function () {
            this.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere(
                  "club_external_members.fname",
                  "ilike",
                  `%${filter.textSearch}%`
                )
                .orWhere(
                  "club_external_members.lname",
                  "ilike",
                  `%${filter.textSearch}%`
                )
                .orWhere(
                  "student_groups.student_group_name",
                  "ilike",
                  `%${filter.textSearch}%`
                );
            });
          });
        }
        if (filter.courtId > 0) {
          builder.where("courts.court_id", filter.courtId);
        }
        if (filter.eventTypeId > 0) {
          builder.where("event_types.event_type_id", filter.eventTypeId);
        }
      })
      .andWhere("clubs.club_id", filter.clubId)
      .andWhere("bookings.booking_status_type_id", 2)
      .orderBy("bookings.booking_id")
      .limit(bookingsPerPage)
      .offset(offset);

    const count = await db
      .countDistinct("bookings.booking_id AS count")
      .from("bookings")
      .leftJoin("clubs", "clubs.club_id", "=", "bookings.club_id")
      .leftJoin(
        "event_types",
        "event_types.event_type_id",
        "=",
        "bookings.event_type_id"
      )
      .leftJoin("courts", "courts.court_id", "=", "bookings.court_id")
      .leftJoin("players", function () {
        this.on("players.user_id", "=", "bookings.inviter_id").orOn(
          "players.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "bookings.inviter_id").orOn(
          "trainers.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .leftJoin("club_external_members", function () {
        this.on(
          "club_external_members.user_id",
          "=",
          "bookings.inviter_id"
        ).orOn("club_external_members.user_id", "=", "bookings.invitee_id");
      })
      .leftJoin("student_groups", function () {
        this.on("student_groups.user_id", "=", "bookings.inviter_id").orOn(
          "student_groups.user_id",
          "=",
          "bookings.invitee_id"
        );
      })
      .where((builder) => {
        if (filter.textSearch !== "") {
          builder.where(function () {
            this.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere(
                  "club_external_members.fname",
                  "ilike",
                  `%${filter.textSearch}%`
                )
                .orWhere(
                  "club_external_members.lname",
                  "ilike",
                  `%${filter.textSearch}%`
                )
                .orWhere(
                  "student_groups.student_group_name",
                  "ilike",
                  `%${filter.textSearch}%`
                );
            });
          });
        }
        if (filter.courtId > 0) {
          builder.where("courts.court_id", filter.courtId);
        }
        if (filter.eventTypeId > 0) {
          builder.where("event_types.event_type_id", filter.eventTypeId);
        }
      })
      .andWhere("clubs.club_id", filter.clubId)
      .andWhere("bookings.booking_status_type_id", 2);

    const data = {
      bookings: paginatedBookings,
      totalPages: Math.ceil(count[0].count / bookingsPerPage),
    };

    return data;
  },
  async getClubCalendarBookedHours(filter) {
    try {
      const bookedCourtHours = await db("bookings")
        .where((builder) => {
          if (filter.court_id > 0) {
            builder.where("bookings.court_id", filter.court_id);
          }
        })
        .andWhere("bookings.club_id", filter.club_id)
        .andWhere((builder) => {
          builder
            .where("bookings.booking_status_type_id", 1)
            .orWhere("bookings.booking_status_type_id", 2);
        });

      return bookedCourtHours;
    } catch (error) {
      console.log("Error fetching club's booked court hours: ", error);
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
