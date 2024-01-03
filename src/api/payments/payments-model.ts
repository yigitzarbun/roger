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

  async getPlayerPaymentsByUserId(userId: number) {
    try {
      const payments = await db
        .select(
          "payments.*",
          "bookings.event_date",
          "clubs.club_name",
          "trainers.*"
          // "players.*"
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
        /*
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "payments.sender_invitee_id").orOn(
            "players.user_id",
            "=",
            "payments.sender_inviter_id"
          );
        })
        */
        .where((queryBuilder) => {
          queryBuilder
            .where("payments.sender_inviter_id", userId)
            .orWhere("payments.sender_invitee_id", userId)
            .orWhere("payments.sender_subscriber_id", userId);
        });
      /*
        .whereNot((notBuilder) => {
          notBuilder.where("players.user_id", userId);
        });
*/
      return payments;
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
