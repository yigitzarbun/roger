const db = require("../../data/dbconfig");

const courtsModel = {
  async getAll() {
    const courts = await db("courts");
    return courts;
  },

  async getPaginated(page) {
    const courtsPerPage = 4;
    const offset = (page - 1) * courtsPerPage;

    const courts = await db("courts");

    const paginatedCourts = await db("courts")
      .orderBy("court_id", "asc")
      .limit(courtsPerPage)
      .offset(offset);

    const data = {
      courts: paginatedCourts,
      totalPages: Math.ceil(courts.length / courtsPerPage),
    };
    return data;
  },

  async getByFilter(filter) {
    const courts = await db("courts").where((builder) => {
      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }
      if (filter.is_active) {
        builder.where("is_active", filter.is_active);
      }

      if (filter.price_hour) {
        builder.where("price_hour", filter.price_hour);
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return courts;
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
