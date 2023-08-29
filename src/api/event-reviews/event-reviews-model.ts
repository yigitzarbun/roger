const db = require("../../data/dbconfig");

const eventReviewsModel = {
  async getAll() {
    const eventReviews = await db("event_reviews");
    return eventReviews;
  },

  async getByFilter(filter) {
    const eventReview = await db("event_reviews").where(filter).first();
    return eventReview;
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
