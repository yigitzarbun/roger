const db = require("../../data/dbconfig");

const clubSubscriptionPackagesModel = {
  async getAll() {
    const clubSubscriptionPackages = await db("club_subscription_packages");

    return clubSubscriptionPackages;
  },

  async getByFilter(filter) {
    const clubSubscriptionPackage = await db("club_subscription_packages")
      .where(filter)
      .first();
    return clubSubscriptionPackage;
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
      .where("club_subscription_package_id", updates.club_id)
      .update(updates);
  },
};

export default clubSubscriptionPackagesModel;
