const db = require("../../data/dbconfig");

const clubSubscriptionsModel = {
  async getAll() {
    const clubSubscriptions = await db("club_subscriptions");

    return clubSubscriptions;
  },

  async getByFilter(filter) {
    const clubSubscriptions = await db("club_subscriptions").where(
      (builder) => {
        if (filter.club_id) {
          builder.where("club_id", filter.club_id);
        }
        if (filter.is_active) {
          builder.where("is_active", filter.is_active);
        }
        if (filter.club_subscription_id) {
          builder.where("club_subscription_id", filter.club_subscription_id);
        }
        if (filter.player_id) {
          builder.where("player_id", filter.player_id);
        }
        if (filter.sortBy) {
          // handle sorting here if required
          builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
        }
      }
    );
    return clubSubscriptions;
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
