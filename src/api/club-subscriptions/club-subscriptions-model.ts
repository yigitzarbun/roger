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
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.gender as playerGenderName",
          "players.birth_year as playerBirthYear",
          "player_levels.player_level_name as playerLevelName",
          "player_locations.*",
          "player_locations.location_name as locationName",
          "club_external_members.fname as externalFname",
          "club_external_members.lname as externalLname",
          "club_external_members.user_id as externalUserId",
          "club_external_members.gender as externalGenderName",
          "club_external_members.birth_year as externalBirthYear",
          "external_player_levels.player_level_name as externalLevelName",
          "external_locations.location_name as externalLocationName",
          "users.*",
          db.raw("AVG(event_reviews.review_score) as averageReviewScore"),
          db.raw(
            "COUNT(DISTINCT event_reviews.review_score) as reviewScoreCount"
          )
        )
        .from("club_subscriptions")
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "users.user_id");
        })
        .leftJoin("club_external_members", function () {
          this.on("club_external_members.user_id", "=", "users.user_id");
        })
        .leftJoin("locations as player_locations", function () {
          this.on("player_locations.location_id", "=", "players.location_id");
        })
        .leftJoin("locations as external_locations", function () {
          this.on(
            "external_locations.location_id",
            "=",
            "club_external_members.location_id"
          );
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("player_levels as external_player_levels", function () {
          this.on(
            "external_player_levels.player_level_id",
            "=",
            "club_external_members.player_level_id"
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
          "player_locations.location_id",
          "player_levels.player_level_id",
          "player_levels.player_level_name",
          "player_locations.location_name",
          "players.birth_year",
          "club_external_members.fname",
          "club_external_members.lname",
          "club_external_members.user_id",
          "club_external_members.gender",
          "external_player_levels.player_level_name",
          "external_locations.location_name",
          "club_external_members.birth_year",
          "users.user_id"
        );

      return clubSubscribers.length > 0 ? clubSubscribers : null;
    } catch (error) {
      console.log("Error fetching club subscribers: ", error);
    }
  },
  async getPaginatedClubSubscribers(filter) {
    const subscribersPerPage = 4;
    const offset = (filter.page - 1) * subscribersPerPage;

    try {
      const clubSubscribers = await db
        .select(
          "club_subscriptions.*",
          "players.*",
          "players.image as playerImage",
          "players.user_id as playerUserId",
          "player_locations.location_name as playerLocationName",
          "player_levels.player_level_name as playerLevelName",
          "club_external_members.*",
          "external_locations.location_name as externalLocationName",
          "external_player_levels.player_level_name as externalLevelName",
          "club_subscription_packages.*",
          "club_subscription_types.*",
          "user_types.*",
          "users.*"
        )
        .from("club_subscriptions")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("locations as player_locations", function () {
          this.on("player_locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("club_external_members", function () {
          this.on("club_external_members.user_id", "=", "users.user_id");
        })
        .leftJoin("locations as external_locations", function () {
          this.on(
            "external_locations.location_id",
            "=",
            "club_external_members.location_id"
          );
        })
        .leftJoin("player_levels as external_player_levels", function () {
          this.on(
            "external_player_levels.player_level_id",
            "=",
            "club_external_members.player_level_id"
          );
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
            "club_subscription_types.club_subscription_type_id",
            "=",
            "club_subscription_packages.club_subscription_type_id"
          );
        })
        .leftJoin("user_types", function () {
          this.on("user_types.user_type_id", "=", "users.user_type_id");
        })
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder
              .where("players.fname", "ilike", `%${filter.textSearch}%`)
              .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
              .orWhere(
                "club_external_members.fname",
                "ilike",
                `%${filter.textSearch}%`
              )
              .orWhere(
                "club_external_members.lname",
                "ilike",
                `%${filter.textSearch}%`
              );
          }
          if (filter.clubSubscriptionTypeId > 0) {
            builder.where(
              "club_subscription_types.club_subscription_type_id",
              filter.clubSubscriptionTypeId
            );
          }
          if (filter.playerLevelId > 0) {
            builder.where(
              "player_levels.player_level_id",
              filter.playerLevelId
            );
          }
          if (filter.locationId > 0) {
            builder.where("player_locations.location_id", filter.locationId);
          }
          if (filter.userTypeId > 0) {
            builder.where("user_types.user_type_id", filter.userTypeId);
          }
        })
        .andWhere("club_subscriptions.club_id", filter.userId)
        .andWhere("club_subscriptions.is_active", true)
        .offset(offset)
        .limit(subscribersPerPage);

      const count = await db
        .select(db.raw("COUNT(*) as total"))
        .from("club_subscriptions")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("locations as player_locations", function () {
          this.on("player_locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "club_subscriptions.player_id");
        })
        .leftJoin("club_external_members", function () {
          this.on("club_external_members.user_id", "=", "users.user_id");
        })
        .leftJoin("locations as external_locations", function () {
          this.on(
            "external_locations.location_id",
            "=",
            "club_external_members.location_id"
          );
        })
        .leftJoin("player_levels as external_player_levels", function () {
          this.on(
            "external_player_levels.player_level_id",
            "=",
            "club_external_members.player_level_id"
          );
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
            "club_subscription_types.club_subscription_type_id",
            "=",
            "club_subscription_packages.club_subscription_type_id"
          );
        })
        .leftJoin("user_types", function () {
          this.on("user_types.user_type_id", "=", "users.user_type_id");
        })
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder
              .where("players.fname", "ilike", `%${filter.textSearch}%`)
              .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
              .orWhere(
                "club_external_members.fname",
                "ilike",
                `%${filter.textSearch}%`
              )
              .orWhere(
                "club_external_members.lname",
                "ilike",
                `%${filter.textSearch}%`
              );
          }
          if (filter.clubSubscriptionTypeId > 0) {
            builder.where(
              "club_subscription_types.club_subscription_type_id",
              filter.clubSubscriptionTypeId
            );
          }
          if (filter.playerLevelId > 0) {
            builder.where(
              "player_levels.player_level_id",
              filter.playerLevelId
            );
          }
          if (filter.locationId > 0) {
            builder.where("player_locations.location_id", filter.locationId);
          }
          if (filter.userTypeId > 0) {
            builder.where("user_types.user_type_id", filter.userTypeId);
          }
        })
        .andWhere("club_subscriptions.club_id", filter.userId)
        .andWhere("club_subscriptions.is_active", true);

      const total = count[0].total;
      const totalPages = Math.ceil(total / subscribersPerPage);

      const data = {
        subscribers: clubSubscribers,
        totalPages: totalPages,
      };

      return data;
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
