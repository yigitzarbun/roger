const db = require("../../data/dbconfig");

const paymentsModel = {
  async getAll() {
    const payments = await db("payments");
    return payments;
  },

  async getByFilter(filter) {
    const payments = await db("payments").where((builder) => {
      if (filter.payment_id) {
        builder.where("payment_id", filter.payment_id);
      }
      if (filter.sortBy) {
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return payments;
  },

  async getById(payment_id) {
    const payment = await db("payments").where("payment_id", payment_id);
    return payment;
  },

  async getPlayerPaymentsByUserId(filter) {
    try {
      const paymentsPerPage = filter.perPage;
      const currentPage = filter.currentPageNumber || 1;
      const offset = (currentPage - 1) * paymentsPerPage;
      const payments = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date",
          "clubs.club_name",
          "trainers.*",
          "bookings.*",
          "players.*",
          "courts.*",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", function () {
          this.on("bookings.payment_id", "=", "payments.payment_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "payments.recipient_club_id");
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "payments.recipient_trainer_id");
        })
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "payments.sender_invitee_id").orOn(
            "players.user_id",
            "=",
            "payments.sender_inviter_id"
          );
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("payment_types", function () {
          this.on(
            "payment_types.payment_type_id",
            "=",
            "payments.payment_type_id"
          );
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
          if (filter.status !== "") {
            builder.where("payments.payment_status", filter.status);
          }
          if (filter.paymentTypeId > 0) {
            builder.where(
              "payment_types.payment_type_id",
              filter.paymentTypeId
            );
          }
        })
        .andWhere((queryBuilder) => {
          queryBuilder
            .where("payments.sender_inviter_id", filter.userId)
            .orWhere("payments.sender_invitee_id", filter.userId)
            .orWhere("payments.sender_subscriber_id", filter.userId);
        })
        .whereNot((notBuilder) => {
          notBuilder.where("players.user_id", filter.userId);
        })
        .limit(paymentsPerPage)
        .offset(offset);

      const pageCount = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date",
          "clubs.club_name",
          "trainers.*",
          "bookings.*",
          "players.*",
          "courts.*",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", function () {
          this.on("bookings.payment_id", "=", "payments.payment_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "payments.recipient_club_id");
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "payments.recipient_trainer_id");
        })
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "payments.sender_invitee_id").orOn(
            "players.user_id",
            "=",
            "payments.sender_inviter_id"
          );
        })
        .leftJoin("courts", function () {
          this.on("courts.court_id", "=", "bookings.court_id");
        })
        .leftJoin("payment_types", function () {
          this.on(
            "payment_types.payment_type_id",
            "=",
            "payments.payment_type_id"
          );
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
          if (filter.status !== "") {
            builder.where("payments.payment_status", filter.status);
          }
          if (filter.paymentTypeId > 0) {
            builder.where(
              "payment_types.payment_type_id",
              filter.paymentTypeId
            );
          }
        })
        .andWhere((queryBuilder) => {
          queryBuilder
            .where("payments.sender_inviter_id", filter.userId)
            .orWhere("payments.sender_invitee_id", filter.userId)
            .orWhere("payments.sender_subscriber_id", filter.userId);
        })
        .whereNot((notBuilder) => {
          notBuilder.where("players.user_id", filter.userId);
        });

      const data = {
        payments: payments,
        totalPages: Math.ceil(pageCount.length / paymentsPerPage),
      };
      return data;
    } catch (error) {
      // Handle any potential errors
      console.error("Error fetching player payments:", error);
      throw new Error("Unable to fetch player payments.");
    }
  },

  async add(payment) {
    const [newPayment] = await db("payments").insert(payment).returning("*");
    return newPayment;
  },

  async update(updates) {
    return await db("payments")
      .where("payment_id", updates.payment_id)
      .update(updates);
  },
};

export default paymentsModel;
