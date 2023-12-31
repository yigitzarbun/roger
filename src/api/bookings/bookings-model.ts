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
        .where("bookings.booking_status_type_id", 2)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId);
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
        .where("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.invitee_id", userId)
            .orWhere("bookings.inviter_id", userId);
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
