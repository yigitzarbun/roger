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
          "payments.payment_id",
          "payments.payment_status",
          "payments.registered_at as paymentDate",
          "payments.lesson_price",
          "payments.court_price",
          "payments.subscription_price",
          "payments.payment_amount",
          "payments.payment_type_id",
          "payments.tournament_admission_fee",
          "bookings.event_date",
          "bookings.event_time",
          "clubs.club_name",
          "payment_types.payment_type_name",
          "courts.court_name",
          db.raw(
            `(SELECT array_agg(DISTINCT CONCAT(p.fname, ' ', p.lname))
              FROM players p
              WHERE (p.user_id = payments.sender_invitee_id OR p.user_id = payments.sender_inviter_id)
              AND p.user_id <> ?) as player_names`,
            [filter.userId]
          ),
          db.raw(
            `(SELECT array_agg(DISTINCT CONCAT(t.fname, ' ', t.lname))
              FROM trainers t
              WHERE t.user_id = payments.recipient_trainer_id
              AND t.user_id <> ?) as trainer_names`,
            [filter.userId]
          )
        )
        .from("payments")
        .leftJoin("bookings", "bookings.payment_id", "payments.payment_id")
        .leftJoin("clubs", "clubs.user_id", "payments.recipient_club_id")
        .leftJoin("courts", "courts.court_id", "bookings.court_id")
        .leftJoin(
          "payment_types",
          "payment_types.payment_type_id",
          "payments.payment_type_id"
        )
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "payments.sender_invitee_id").orOn(
            "players.user_id",
            "=",
            "payments.sender_inviter_id"
          );
        })
        .leftJoin(
          "trainers",
          "trainers.user_id",
          "payments.recipient_trainer_id"
        )
        .where((queryBuilder) => {
          if (filter.textSearch) {
            queryBuilder.where((qb) => {
              qb.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
            });
          }
          if (filter.clubId > 0) {
            queryBuilder.andWhere("clubs.user_id", filter.clubId);
          }
          if (filter.status !== "") {
            queryBuilder.andWhere("payments.payment_status", filter.status);
          }
          if (filter.paymentTypeId > 0) {
            queryBuilder.andWhere(
              "payments.payment_type_id",
              filter.paymentTypeId
            );
          }
          queryBuilder.andWhere(function () {
            this.where("payments.sender_inviter_id", filter.userId)
              .orWhere("payments.sender_invitee_id", filter.userId)
              .orWhere("payments.sender_subscriber_id", filter.userId)
              .orWhere(
                "payments.sender_tournament_participant_id",
                filter.userId
              );
          });
        })
        .orderBy("payments.registered_at", "desc")
        .limit(paymentsPerPage)
        .offset(offset)
        .groupBy(
          "payments.payment_id",
          "payments.payment_status",
          "payments.registered_at",
          "payments.lesson_price",
          "payments.court_price",
          "payments.subscription_price",
          "payments.payment_amount",
          "payments.payment_type_id",
          "payments.tournament_admission_fee",
          "bookings.event_date", // Include event_date in GROUP BY
          "bookings.event_time",
          "clubs.club_name",
          "payment_types.payment_type_name",
          "courts.court_name"
        ); // Group by payment_id to ensure distinct payments

      const pageCount = await db
        .select(
          "payments.payment_id",
          "payments.payment_status",
          "payments.registered_at as paymentDate",
          "payments.lesson_price",
          "payments.court_price",
          "payments.subscription_price",
          "payments.payment_amount",
          "payments.payment_type_id",
          "payments.payment_id",
          "bookings.event_date",
          "bookings.event_time",
          "clubs.club_name",
          "payment_types.payment_type_name",
          "courts.court_name",
          db.raw(
            `(SELECT array_agg(DISTINCT CONCAT(p.fname, ' ', p.lname))
              FROM players p
              WHERE (p.user_id = payments.sender_invitee_id OR p.user_id = payments.sender_inviter_id)
              AND p.user_id <> ?) as player_names`,
            [filter.userId]
          ),
          db.raw(
            `(SELECT array_agg(DISTINCT CONCAT(t.fname, ' ', t.lname))
              FROM trainers t
              WHERE t.user_id = payments.recipient_trainer_id
              AND t.user_id <> ?) as trainer_names`,
            [filter.userId]
          )
        )
        .from("payments")
        .leftJoin("bookings", "bookings.payment_id", "payments.payment_id")
        .leftJoin("clubs", "clubs.user_id", "payments.recipient_club_id")
        .leftJoin("courts", "courts.court_id", "bookings.court_id")
        .leftJoin(
          "payment_types",
          "payment_types.payment_type_id",
          "payments.payment_type_id"
        )
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "payments.sender_invitee_id").orOn(
            "players.user_id",
            "=",
            "payments.sender_inviter_id"
          );
        })
        .leftJoin(
          "trainers",
          "trainers.user_id",
          "payments.recipient_trainer_id"
        )
        .where((queryBuilder) => {
          if (filter.textSearch) {
            queryBuilder.where((qb) => {
              qb.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere(
                  "payments.sender_tournament_participant_id",
                  filter.userId
                );
            });
          }
          if (filter.clubId > 0) {
            queryBuilder.andWhere("clubs.user_id", filter.clubId);
          }
          if (filter.status !== "") {
            queryBuilder.andWhere("payments.payment_status", filter.status);
          }
          if (filter.paymentTypeId > 0) {
            queryBuilder.andWhere(
              "payments.payment_type_id",
              filter.paymentTypeId
            );
          }
          queryBuilder.andWhere(function () {
            this.where("payments.sender_inviter_id", filter.userId)
              .orWhere("payments.sender_invitee_id", filter.userId)
              .orWhere("payments.sender_subscriber_id", filter.userId);
          });
        })
        .orderBy("payments.registered_at", "desc")
        .groupBy(
          "payments.payment_id",
          "payments.payment_status",
          "payments.registered_at",
          "payments.lesson_price",
          "payments.court_price",
          "payments.subscription_price",
          "payments.payment_amount",
          "payments.payment_type_id",
          "payments.tournament_admission_fee",
          "bookings.event_date", // Include event_date in GROUP BY
          "bookings.event_time",
          "clubs.club_name",
          "payment_types.payment_type_name",
          "courts.court_name"
        ); // Group by payment_id to ensure distinct payments

      //const totalPaymentsCount = parseInt(pageCountQuery[0].total);
      //const totalPages = Math.ceil(totalPaymentsCount / paymentsPerPage);
      const totalPages = Math.ceil(pageCount.length / paymentsPerPage);
      return { payments, totalPages };
    } catch (error) {
      console.error("Error fetching player payments:", error);
      throw new Error("Unable to fetch player payments.");
    }
  },
  async getClubPaymentsByUserId(filter) {
    try {
      const paymentsPerPage = 4;
      const currentPage = filter.currentPageNumber || 1;
      const offset = (currentPage - 1) * paymentsPerPage;
      const payments = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date as eventDate",
          "bookings.event_time as eventTime",
          db.raw(
            "COALESCE(invitee.fname, invitee_external.fname, invitee_trainer.fname, '') as invitee_fname"
          ),
          db.raw(
            "COALESCE(invitee.lname, invitee_external.lname, invitee_trainer.lname, '') as invitee_lname"
          ),
          db.raw(
            "COALESCE(inviter.fname, inviter_external.fname, inviter_trainer.fname, '') as inviter_fname"
          ),
          db.raw(
            "COALESCE(inviter.lname, inviter_external.lname, inviter_trainer.lname, '') as inviter_lname"
          ),
          db.raw(
            "COALESCE(subscriber.fname, subscriber_external.fname, '') as subscriber_fname"
          ),
          db.raw(
            "COALESCE(subscriber.lname, subscriber_external.lname, '') as subscriber_lname"
          ),
          "courts.court_name",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", "bookings.payment_id", "payments.payment_id")
        .leftJoin(
          "players as invitee",
          "invitee.user_id",
          "payments.sender_invitee_id"
        )
        .leftJoin(
          "players as inviter",
          "inviter.user_id",
          "payments.sender_inviter_id"
        )
        .leftJoin(
          "club_external_members as invitee_external",
          "invitee_external.user_id",
          "payments.sender_invitee_id"
        )
        .leftJoin(
          "club_external_members as inviter_external",
          "inviter_external.user_id",
          "payments.sender_inviter_id"
        )
        .leftJoin(
          "trainers as inviter_trainer",
          "inviter_trainer.user_id",
          "payments.recipient_trainer_id"
        )
        .leftJoin(
          "trainers as invitee_trainer",
          "invitee_trainer.user_id",
          "payments.recipient_trainer_id"
        )

        .leftJoin(
          "players as subscriber",
          "subscriber.user_id",
          "payments.sender_subscriber_id"
        )
        .leftJoin(
          "club_external_members as subscriber_external",
          "subscriber_external.user_id",
          "payments.sender_subscriber_id"
        )
        .leftJoin("courts", "courts.court_id", "bookings.court_id")
        .leftJoin(
          "payment_types",
          "payment_types.payment_type_id",
          "payments.payment_type_id"
        )
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.whereRaw("LOWER(invitee.fname) like ?", [
                `%${filter.textSearch.toLowerCase()}%`,
              ])
                .orWhereRaw("LOWER(invitee.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_trainer.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_trainer.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_trainer.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_trainer.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ]);
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
        .andWhere("payments.recipient_club_id", filter.userId)
        .orderBy("payments.registered_at", "desc")
        .limit(paymentsPerPage)
        .offset(offset);

      const pageCount = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date as eventDate",
          "bookings.event_time as eventTime",
          db.raw(
            "COALESCE(invitee.fname, invitee_external.fname, invitee_trainer.fname, '') as invitee_fname"
          ),
          db.raw(
            "COALESCE(invitee.lname, invitee_external.lname, invitee_trainer.lname, '') as invitee_lname"
          ),
          db.raw(
            "COALESCE(inviter.fname, inviter_external.fname, inviter_trainer.fname, '') as inviter_fname"
          ),
          db.raw(
            "COALESCE(inviter.lname, inviter_external.lname, inviter_trainer.lname, '') as inviter_lname"
          ),
          db.raw(
            "COALESCE(subscriber.fname, subscriber_external.fname, '') as subscriber_fname"
          ),
          db.raw(
            "COALESCE(subscriber.lname, subscriber_external.lname, '') as subscriber_lname"
          ),
          "courts.court_name",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", "bookings.payment_id", "payments.payment_id")
        .leftJoin(
          "players as invitee",
          "invitee.user_id",
          "payments.sender_invitee_id"
        )
        .leftJoin(
          "players as inviter",
          "inviter.user_id",
          "payments.sender_inviter_id"
        )
        .leftJoin(
          "club_external_members as invitee_external",
          "invitee_external.user_id",
          "payments.sender_invitee_id"
        )
        .leftJoin(
          "club_external_members as inviter_external",
          "inviter_external.user_id",
          "payments.sender_inviter_id"
        )
        .leftJoin(
          "trainers as inviter_trainer",
          "inviter_trainer.user_id",
          "payments.recipient_trainer_id"
        )
        .leftJoin(
          "trainers as invitee_trainer",
          "invitee_trainer.user_id",
          "payments.recipient_trainer_id"
        )

        .leftJoin(
          "players as subscriber",
          "subscriber.user_id",
          "payments.sender_subscriber_id"
        )
        .leftJoin(
          "club_external_members as subscriber_external",
          "subscriber_external.user_id",
          "payments.sender_subscriber_id"
        )
        .leftJoin("courts", "courts.court_id", "bookings.court_id")
        .leftJoin(
          "payment_types",
          "payment_types.payment_type_id",
          "payments.payment_type_id"
        )
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.whereRaw("LOWER(invitee.fname) like ?", [
                `%${filter.textSearch.toLowerCase()}%`,
              ])
                .orWhereRaw("LOWER(invitee.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber_external.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(subscriber_external.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_trainer.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(invitee_trainer.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_trainer.fname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ])
                .orWhereRaw("LOWER(inviter_trainer.lname) like ?", [
                  `%${filter.textSearch.toLowerCase()}%`,
                ]);
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
        .andWhere("payments.recipient_club_id", filter.userId);

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
  async getTrainerPaymentsByUserId(filter) {
    try {
      const paymentsPerPage = filter.perPage;
      const currentPage = filter.currentPageNumber || 1;
      const offset = (currentPage - 1) * paymentsPerPage;
      const payments = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date as eventDate",
          "bookings.event_time as eventTime",
          "clubs.club_name",
          "players.fname",
          "players.lname",
          "courts.court_name",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", function () {
          this.on("bookings.payment_id", "=", "payments.payment_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "payments.recipient_club_id");
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
              this.where(
                "players.fname",
                "ilike",
                `%${filter.textSearch}%`
              ).orWhere("players.lname", "ilike", `%${filter.textSearch}%`);
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
          queryBuilder.where("payments.recipient_trainer_id", filter.userId);
        })
        .orderBy("payments.registered_at", "desc")
        .limit(paymentsPerPage)
        .offset(offset);

      const pageCount = await db
        .select(
          "payments.*",
          "payments.registered_at as paymentDate",
          "bookings.event_date as eventDate",
          "bookings.event_time as eventTime",
          "clubs.club_name",
          "players.fname",
          "players.lname",
          "courts.court_name",
          "payment_types.*"
        )
        .from("payments")
        .leftJoin("bookings", function () {
          this.on("bookings.payment_id", "=", "payments.payment_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "payments.recipient_club_id");
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
              this.where(
                "players.fname",
                "ilike",
                `%${filter.textSearch}%`
              ).orWhere("players.lname", "ilike", `%${filter.textSearch}%`);
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
          queryBuilder.where("payments.recipient_trainer_id", filter.userId);
        });

      const data = {
        payments: payments,
        totalPages: Math.ceil(pageCount.length / paymentsPerPage),
      };
      return data;
    } catch (error) {
      // Handle any potential errors
      console.error("Error fetching trainer payments:", error);
      throw new Error("Unable to fetch trainer payments.");
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
