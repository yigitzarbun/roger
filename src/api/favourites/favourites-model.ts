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

  async getPlayerFavouritesByUserId(userId: number) {
    try {
      const favourites = await db
        .select(
          "favourites.*",
          "players.*",
          "trainers.*",
          "clubs.*",
          "users.*",
          "user_types.*",
          "locations.*"
        )
        .from("favourites")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "favourites.favouritee_id");
        })
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "favourites.favouritee_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "favourites.favouritee_id");
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "favourites.favouritee_id");
        })
        .leftJoin("user_types", function () {
          this.on("user_types.user_type_id", "=", "users.user_type_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "players.location_id")
            .orOn("locations.location_id", "=", "trainers.location_id")
            .orOn("locations.location_id", "=", "clubs.location_id");
        })
        .where("favourites.is_active", true)
        .andWhere("favourites.favouriter_id", userId)
        .andWhere("users.user_status_type_id", 1);
      return favourites;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch player favourites.");
    }
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
