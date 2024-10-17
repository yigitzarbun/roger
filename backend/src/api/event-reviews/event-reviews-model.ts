const db = require("../../data/dbconfig");

const eventReviewsModel = {
  async getAll() {
    const eventReviews = await db("event_reviews");
    return eventReviews;
  },
  async getByFilter(filter) {
    const eventReviews = await db("event_reviews").where((builder) => {
      if (filter.user_id) {
        builder
          .where("reviewer_id", filter.user_id)
          .orWhere("reviewee_id", filter.user_id);
      }
      if (filter.reviewer_id) {
        builder.where("reviewer_id", filter.reviewer_id);
      }
      if (filter.booking_id) {
        builder.where("booking_id", Number(filter.booking_id));
      }
      if (filter.is_active) {
        builder.where("is_active", filter.is_active);
      }
      if (filter.reviewer_id_not_equal) {
        builder.whereNot("reviewer_id", filter.reviewer_id_not_equal);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return eventReviews;
  },
  async getUserReceivedReviews(userId: number) {
    const userReceivedReviews = await db
      .select(
        "event_reviews.event_review_id",
        "event_reviews.event_review_title",
        "event_reviews.registered_at",
        "event_reviews.event_review_description",
        "event_reviews.review_score",
        "event_reviews.reviewer_id",
        "users.user_type_id",
        "players.image as playerImage",
        "players.fname as playerFname",
        "players.lname as playerLname",
        "trainers.image",
        "trainers.fname",
        "trainers.lname",
        //"clubs.*",
        //"bookings.*",
        "event_types.event_type_name",
        "event_types.event_type_id"
      )
      .from("event_reviews")
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "event_reviews.reviewer_id");
      })
      .leftJoin("players", function () {
        this.on("players.user_id", "=", "event_reviews.reviewer_id");
      })
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "event_reviews.reviewer_id");
      })
      /*
      .leftJoin("clubs", function () {
        this.on("clubs.user_id", "=", "event_reviews.reviewer_id");
      })
      */
      .leftJoin("bookings", function () {
        this.on("bookings.booking_id", "=", "event_reviews.booking_id");
      })
      .leftJoin("event_types", function () {
        this.on("event_types.event_type_id", "=", "bookings.event_type_id");
      })
      .where("bookings.booking_status_type_id", 5)
      .andWhere("event_reviews.reviewee_id", userId)
      .andWhere("event_reviews.is_active", true);

    return userReceivedReviews;
  },
  async getReviewDetailsByFilter(filter) {
    const eventDetails = await db
      .select(
        "event_reviews.event_review_id",
        "event_reviews.event_review_title",
        "event_reviews.registered_at",
        "event_reviews.event_review_description",
        "event_reviews.review_score",
        "event_types.event_type_name",
        "event_types.event_type_id",
        "event_reviews.reviewer_id",
        "users.user_type_id",
        "players.image",
        "trainers.image",
        "players.fname",
        "players.lname",
        "trainers.fname",
        "trainers.lname"
      )
      .from("event_reviews")
      .leftJoin("users", function () {
        this.on("event_reviews.reviewer_id", "=", "users.user_id").orOn(
          "event_reviews.reviewee_id",
          "=",
          "users.user_id"
        );
      })
      .leftJoin("players", function () {
        this.on("players.user_id", "=", "users.user_id");
      })
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "users.user_id");
      })
      .leftJoin("bookings", function () {
        this.on("bookings.booking_id", "=", "event_reviews.booking_id");
      })
      .leftJoin("event_types", function () {
        this.on("event_types.event_type_id", "=", "bookings.event_type_id");
      })
      /*
      .leftJoin("student_groups", function () {
        this.on("student_groups.user_id", "=", "bookings.invitee_id");
      })
      */
      .where("bookings.booking_status_type_id", 5)
      .andWhere("bookings.booking_id", filter.bookingId)
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
      })
      .andWhere(function () {
        this.whereNot("event_reviews.reviewer_id", filter.userId);
      });
    return eventDetails;
  },
  async getById(event_review_id) {
    const eventReview = await db("event_reviews").where(
      "event_review_id",
      event_review_id
    );
    return eventReview;
  },
  async getPlayerMissingEventReviewsNumber(userId: number) {
    try {
      const myEventsCount = await db
        .count("* as count")
        .from("bookings")
        .where((builder) => {
          builder
            .where("bookings.event_type_id", 1)
            .orWhere("bookings.event_type_id", 2)
            .orWhere("bookings.event_type_id", 3);
        })
        .andWhere("bookings.booking_status_type_id", 5)
        .andWhere((builder) => {
          builder
            .where("bookings.inviter_id", userId)
            .orWhere("bookings.invitee_id", userId);
        })
        .first();

      const myReviewsCount = await db
        .count("* as count")
        .from("event_reviews")
        .where("event_reviews.reviewer_id", userId)
        .andWhere("event_reviews.is_active", true)
        .first();

      const missingReviewsCount = myEventsCount.count - myReviewsCount.count;

      return missingReviewsCount >= 0 ? missingReviewsCount : 0; // Ensuring non-negative count
    } catch (error) {
      console.log(error);
      throw new Error("Unable to fetch missing event reviews.");
    }
  },
  async add(eventReview) {
    const [newEventReview] = await db("event_reviews")
      .insert(eventReview)
      .returning("*");
    return newEventReview;
  },
  async update(updates) {
    return await db("event_reviews")
      .where("event_review_id", updates.event_review_id)
      .update(updates);
  },
};

export default eventReviewsModel;
