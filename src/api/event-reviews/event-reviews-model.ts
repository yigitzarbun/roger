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
