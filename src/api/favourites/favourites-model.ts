const db = require("../../data/dbconfig");

const favouritesModel = {
  async getAll() {
    const favourites = await db("favourites");
    return favourites;
  },

  async getByFilter(filter) {
    const favourites = await db("favourites").where((builder) => {
      if (filter.favourite_id) {
        builder.where("favourite_id", filter.favourite_id);
      }
      if (filter.is_active) {
        builder.where("is_active", filter.is_active);
      }

      if (filter.favouriter_id) {
        builder.where("favouriter_id", filter.favouriter_id);
      }
      if (filter.favouritee_id) {
        builder.where("favouritee_id", filter.favouritee_id);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });
    return favourites;
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
