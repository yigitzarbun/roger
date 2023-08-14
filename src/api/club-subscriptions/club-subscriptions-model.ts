const db = require("../../data/dbconfig");

const clubSubscriptionsModel = {
  async getAll() {
    const clubSubscriptions = await db("club_subscriptions");

    return clubSubscriptions;
  },

  async getByFilter(filter) {
    const clubSubscription = await db("club_subscriptions")
      .where(filter)
      .first();
    return clubSubscription;
  },

  async getById(club_subscription_id) {
    const clubSubscription = await db("club_subscriptions").where(
      "club_subscription_id",
      club_subscription_id
    );
    return clubSubscription;
  },

  async add(clubSubscription) {
    const [newClubSubscription] = await db("club_subscriptions")
      .insert(clubSubscription)
      .returning("*");
    return newClubSubscription;
  },

  async update(updates) {
    return await db("club_subscriptions")
      .where("club_subscription_id", updates.club_subscription_id)
      .update(updates);
  },
};

export default clubSubscriptionsModel;
