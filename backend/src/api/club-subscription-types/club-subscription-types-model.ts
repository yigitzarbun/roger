const db = require("../../data/dbconfig");

const clubSubscriptionTypesModel = {
  async getAll() {
    const clubSubscriptionTypes = await db("club_subscription_types");
    return clubSubscriptionTypes;
  },
};

export default clubSubscriptionTypesModel;
