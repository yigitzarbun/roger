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
          "users.user_type_id",
          "user_types.user_type_name",
          "players.image",
          "trainers.image",
          "clubs.image",
          "players.fname",
          "players.lname",
          "trainers.fname",
          "trainers.lname",
          "clubs.club_name",
          "player_levels.player_level_name",
          "trainer_experience_types.trainer_experience_type_name",
          "locations.location_name"
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
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
  async getPaginatedFavourites(filter) {
    try {
      const favouritesPerPage = 4;
      const offset = (filter.currentPage - 1) * favouritesPerPage;
      const favourites = await db
        .select(
          "favourites.*",
          "users.user_type_id",
          "user_types.user_type_name",
          "players.image",
          "trainers.image",
          "clubs.image",
          "players.fname",
          "players.lname",
          "trainers.fname",
          "trainers.lname",
          "clubs.club_name",
          "player_levels.player_level_name",
          "player_levels.player_level_id",
          "trainer_experience_types.trainer_experience_type_name",
          "trainer_experience_types.trainer_experience_type_id",
          "locations.location_name"
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("clubs.club_name", "ilike", `%${filter.textSearch}%`);
            });
          }
          if (filter.locationId > 0) {
            builder.where("locations.location_id", filter.locationId);
          }
          if (filter.userTypeId > 0) {
            builder.where("user_types.user_type_id", filter.userTypeId);
          }
        })
        .andWhere("favourites.is_active", true)
        .andWhere("favourites.favouriter_id", filter.userId)
        .andWhere("users.user_status_type_id", 1)
        .limit(favouritesPerPage)
        .offset(offset);

      const count = await db
        .select(
          "favourites.*",
          "users.user_type_id",
          "user_types.user_type_name",
          "players.image",
          "trainers.image",
          "clubs.image",
          "players.fname",
          "players.lname",
          "trainers.fname",
          "trainers.lname",
          "clubs.club_name",
          "player_levels.player_level_name",
          "trainer_experience_types.trainer_experience_type_name",
          "locations.location_name"
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
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .where((builder) => {
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.where("players.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("players.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
                .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`)
                .orWhere("clubs.club_name", "ilike", `%${filter.textSearch}%`);
            });
          }
          if (filter.locationId > 0) {
            builder.where("locations.location_id", filter.locationId);
          }
          if (filter.userTypeId > 0) {
            builder.where("user_types.user_type_id", filter.userTypeId);
          }
        })
        .andWhere("favourites.is_active", true)
        .andWhere("favourites.favouriter_id", filter.userId)
        .andWhere("users.user_status_type_id", 1);

      const data = {
        favourites: favourites,
        totalPages: Math.ceil(count.length / favouritesPerPage),
      };

      return data;
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      throw new Error("Unable to fetch paginated favourites.");
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
