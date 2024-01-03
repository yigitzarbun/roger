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

  async getPlayerMatchScoresWithBookingDetails(userId: number) {
    try {
      const bookings = await db
        .select(
          "match_scores.*",
          "bookings.*",
          "players.*",
          "clubs.*",
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
        .leftJoin("match_scores", function () {
          this.on("match_scores.booking_id", "=", "bookings.booking_id");
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
        .andWhere((builder) => {
          builder.where("bookings.event_type_id", 2);
        })
        .andWhere(function () {
          this.whereNot("players.user_id", userId);
        });

      return bookings;
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
