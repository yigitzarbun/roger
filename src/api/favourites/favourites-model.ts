const db = require("../../data/dbconfig");

const favouritesModel = {
  async getAll() {
    const favourites = await db("favourites");
    return favourites;
  },

  async getByFilter(filter) {
    const favourite = await db("favourites").where(filter).first();
    return favourite;
  },

  async getById(favourite_id) {
    const favourite = await db("favourites").where(
      "favourite_id",
      favourite_id
    );
    return favourite;
  },

  async add(favourite) {
    const [newFavourite] = await db("favourites")
      .insert(favourite)
      .returning("*");
    return newFavourite;
  },

  async update(updates) {
    return await db("favourites")
      .where("favourite_id", updates.favourite_id)
      .update(updates);
  },
};

export default favouritesModel;
