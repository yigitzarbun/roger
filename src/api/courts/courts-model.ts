const db = require("../../data/dbconfig");

const courtsModel = {
  async getAll() {
    const courts = await db("courts");
    return courts;
  },

  async getByFilter(filter) {
    const court = await db("courts").where(filter).first();
    return court;
  },

  async getById(court_id) {
    const court = await db("courts").where("court_id", court_id);
    return court;
  },

  async add(court) {
    const [newCourt] = await db("courts").insert(court).returning("*");
    return newCourt;
  },

  async update(updates) {
    return await db("courts")
      .where("court_id", updates.court_id)
      .update(updates);
  },
};

export default courtsModel;
