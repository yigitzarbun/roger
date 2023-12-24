const db = require("../../data/dbconfig");

const eventReviewsModel = {
  async getAll() {
    const eventReviews = await db("event_reviews");
    return eventReviews;
  },

  async getByFilter(filter) {
    const eventReviews = await db("event_reviews").where((builder) => {
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
