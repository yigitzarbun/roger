const db = require("../../data/dbconfig");

const clubSubscriptionPackagesModel = {
  async getAll() {
    const clubSubscriptionPackages = await db("club_subscription_packages");

    return clubSubscriptionPackages;
  },
  async getByFilter(filter) {
    const clubSubscriptionPackages = await db(
      "club_subscription_packages"
    ).where((builder) => {
      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }
      if (filter.is_active) {
        builder.where("is_active", filter.is_active);
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return clubSubscriptionPackages;
  },
  async getClubSubscriptionPackageDetails(filter) {
    const clubPackageDetails = await db
      .select(
        "club_subscription_packages.*",
        "club_subscription_types.*",
        db.raw(
          "COALESCE(COUNT(DISTINCT CASE WHEN users.user_status_type_id = 1 THEN club_subscriptions.club_subscription_id END), 0) as subscriberCount"
        )
      )
      .from("club_subscription_packages")
      .leftJoin("club_subscription_types", function () {
        this.on(
          "club_subscription_types.club_subscription_type_id",
          "=",
          "club_subscription_packages.club_subscription_type_id"
        );
      })
      .leftJoin("clubs", function () {
        this.on("clubs.user_id", "=", "club_subscription_packages.club_id");
      })
      .leftJoin("club_subscriptions", function () {
        this.on(function () {
          this.on("club_subscriptions.club_id", "=", "clubs.user_id");
          this.andOn(
            "club_subscriptions.club_subscription_package_id",
            "=",
            "club_subscription_packages.club_subscription_package_id"
          );
          this.andOn("club_subscriptions.is_active", "=", db.raw("'true'"));
        });
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "club_subscriptions.player_id");
      })
      .where("club_subscription_packages.club_id", filter.clubId)
      .andWhere("club_subscription_packages.is_active", true)
      .groupBy(
        "club_subscription_packages.club_subscription_package_id",
        "club_subscription_types.club_subscription_type_id",
        "clubs.club_id"
      );

    return clubPackageDetails;
  },
  async getById(club_subscription_package_id) {
    const clubSubscriptionPackage = await db(
      "club_subscription_packages"
    ).where("club_subscription_package_id", club_subscription_package_id);
    return clubSubscriptionPackage;
  },
  async add(clubSubscriptionPackage) {
    const [newClubSubscriptionPackage] = await db("club_subscription_packages")
      .insert(clubSubscriptionPackage)
      .returning("*");
    return newClubSubscriptionPackage;
  },
  async update(updates) {
    return await db("club_subscription_packages")
      .where(
        "club_subscription_package_id",
        updates.club_subscription_package_id
      )
      .update(updates);
  },
};

export default clubSubscriptionPackagesModel;
