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
