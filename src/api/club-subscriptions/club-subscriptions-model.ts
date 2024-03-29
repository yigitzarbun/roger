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

  async getPlayerActiveClubSubscriptionsByUserId(userId: number) {
    try {
      const subscriptions = await db
        .select(
          "club_subscriptions.*",
          "clubs.*",
          "locations.*",
          "club_subscription_packages.*",
          "club_subscription_types.*"
        )
        .from("club_subscriptions")
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "club_subscriptions.club_id");
        })
        .leftJoin("club_subscription_packages", function () {
          this.on(
            "club_subscription_packages.club_subscription_package_id",
            "=",
            "club_subscriptions.club_subscription_package_id"
          );
        })
        .leftJoin("club_subscription_types", function () {
          this.on(
            "club_subscription_packages.club_subscription_type_id",
            "=",
            "club_subscription_types.club_subscription_type_id"
          );
        })
        .leftJoin("locations", function () {
          this.on("clubs.location_id", "=", "locations.location_id");
        })
        .where("club_subscriptions.is_active", true)
        .andWhere((builder) => {
          builder.where("club_subscriptions.player_id", userId);
        });

      return subscriptions;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch player active club subscriptions.");
    }
  },

  async getById(club_subscription_id) {
    const clubSubscription = await db("club_subscriptions").where(
      "club_subscription_id",
      club_subscription_id
    );
    return clubSubscription;
  },

  async getPlayersTrainingSubscriptionStatus(filter) {
    try {
      const inviterSubscriptionStatus = await db("club_subscriptions")
        .select("*")
        .where("player_id", filter.inviterId)
        .andWhere("club_id", filter.clubId)
        .andWhere("is_active", true);

      const inviteeSubscriptionStatus = await db("club_subscriptions")
        .select("*")
        .where("player_id", filter.inviteeId)
        .andWhere("club_id", filter.clubId)
        .andWhere("is_active", true);

      // Check if both arrays have subscriptions
      if (
        inviterSubscriptionStatus.length > 0 &&
        inviteeSubscriptionStatus.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(
        "Error fetching players training subscription status: ",
        error
      );
      // Handle the error accordingly (throw it or return a specific value)
      throw error;
    }
  },

  async getClubSubscribers(userId: number) {
    try {
      const clubSubscribers = await db
        .select(
          "club_subscriptions.*",
          "players.*",
          "players.image as playerImage",
          "players.user_id as playerUserId",
          "locations.*",
          "player_levels",
          "player_levels.player_level_name",
          db.raw("AVG(event_reviews.review_score) as averageReviewScore"),
          db.raw(
            "COUNT(DISTINCT event_reviews.review_score) as reviewScoreCount"
          )
        )
        .from("club_subscriptions")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("event_reviews", function () {
          this.on(
            "event_reviews.reviewee_id",
            "=",
            "club_subscriptions.player_id"
          );
        })
        .where("club_subscriptions.club_id", userId)
        .andWhere("club_subscriptions.is_active", true)
        .groupBy(
          "club_subscriptions.club_subscription_id",
          "players.player_id",
          "locations.location_id",
          "player_levels.player_level_id"
        );

      return clubSubscribers.length > 0 ? clubSubscribers : null;
    } catch (error) {
      console.log("Error fetching club subscribers: ", error);
    }
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
