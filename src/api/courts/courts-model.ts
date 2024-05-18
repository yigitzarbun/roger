const db = require("../../data/dbconfig");

const courtsModel = {
  async getAll() {
    const courts = await db("courts");
    return courts;
  },
  async getPaginated(filter) {
    const courtsPerPage = 4;
    const offset = (filter.page - 1) * courtsPerPage;

    const paginatedCourts = await db
      .select(
        "courts.court_id",
        "courts.image as courtImage",
        "courts.court_name",
        "courts.opening_time",
        "courts.closing_time",
        "courts.price_hour",
        "courts.is_active",
        "courts.price_hour_non_subscriber",
        "clubs.higher_price_for_non_subscribers",
        "clubs.club_name",
        "court_structure_types.court_structure_type_name",
        "court_surface_types.court_surface_type_name",
        "locations.location_name"
      )
      .from("courts")
      .leftJoin("clubs", function () {
        this.on("clubs.club_id", "=", "courts.club_id");
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "clubs.user_id");
      })
      .leftJoin("court_structure_types", function () {
        this.on(
          "court_structure_types.court_structure_type_id",
          "=",
          "courts.court_structure_type_id"
        );
      })
      .leftJoin("court_surface_types", function () {
        this.on(
          "court_surface_types.court_surface_type_id",
          "=",
          "courts.court_surface_type_id"
        );
      })
      .leftJoin("locations", function () {
        this.on("locations.location_id", "=", "clubs.location_id");
      })
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("clubs.location_id", filter.locationId);
        }
        if (filter.clubId > 0) {
          builder.where("courts.club_id", filter.clubId);
        }
        if (filter.courtSurfaceType > 0) {
          builder.where(
            "courts.court_surface_type_id",
            filter.courtSurfaceType
          );
        }
        if (filter.courtStructureType > 0) {
          builder.where(
            "courts.court_structure_type_id",
            filter.courtStructureType
          );
        }
        if (filter.textSearch !== "") {
          builder.where("courts.court_name", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.isActive !== "null") {
          builder.where("courts.is_active", filter.isActive);
        }
      })
      .andWhere("users.user_status_type_id", 1)
      .orderBy("court_id", "asc")
      .limit(courtsPerPage)
      .offset(offset);

    const pageCount = await db
      .select(
        "courts.court_id",
        "courts.image as courtImage",
        "courts.court_name",
        "courts.opening_time",
        "courts.closing_time",
        "courts.price_hour",
        "courts.price_hour_non_subscriber",
        "clubs.higher_price_for_non_subscribers",
        "clubs.club_name",
        "court_structure_types.court_structure_type_name",
        "court_surface_types.court_surface_type_name",
        "locations.location_name"
      )
      .from("courts")
      .leftJoin("clubs", function () {
        this.on("clubs.club_id", "=", "courts.club_id");
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "clubs.user_id");
      })
      .leftJoin("court_structure_types", function () {
        this.on(
          "court_structure_types.court_structure_type_id",
          "=",
          "courts.court_structure_type_id"
        );
      })
      .leftJoin("court_surface_types", function () {
        this.on(
          "court_surface_types.court_surface_type_id",
          "=",
          "courts.court_surface_type_id"
        );
      })
      .leftJoin("locations", function () {
        this.on("locations.location_id", "=", "clubs.location_id");
      })
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("clubs.location_id", filter.locationId);
        }
        if (filter.clubId > 0) {
          builder.where("courts.club_id", filter.clubId);
        }
        if (filter.courtSurfaceType > 0) {
          builder.where(
            "courts.court_surface_type_id",
            filter.courtSurfaceType
          );
        }
        if (filter.courtStructureType > 0) {
          builder.where(
            "courts.court_structure_type_id",
            filter.courtStructureType
          );
        }
        if (filter.textSearch !== "") {
          builder.where("courts.court_name", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.isActive !== "null") {
          builder.where("courts.is_active", filter.isActive);
        }
      })
      .andWhere("users.user_status_type_id", 1);
    const data = {
      courts: paginatedCourts,
      totalPages: Math.ceil(pageCount.length / courtsPerPage),
    };
    return data;
  },
  async getClubCourtsByClubId(clubId: number) {
    const clubCourts = await db
      .select(
        "courts.court_id",
        "courts.image as courtImage",
        "courts.court_name",
        "courts.price_hour",
        "courts.price_hour_non_subscriber",
        "courts.opening_time",
        "courts.closing_time",
        "courts.is_active",
        "clubs.higher_price_for_non_subscribers",
        "court_structure_types.court_structure_type_name",
        "court_surface_types.court_surface_type_name",
        "locations.location_name"
      )
      .from("courts")
      .leftJoin("clubs", function () {
        this.on("clubs.club_id", "=", "courts.club_id");
      })
      .leftJoin("court_structure_types", function () {
        this.on(
          "court_structure_types.court_structure_type_id",
          "=",
          "courts.court_structure_type_id"
        );
      })
      .leftJoin("court_surface_types", function () {
        this.on(
          "court_surface_types.court_surface_type_id",
          "=",
          "courts.court_surface_type_id"
        );
      })
      .leftJoin("locations", function () {
        this.on("locations.location_id", "=", "clubs.location_id");
      })

      .where("courts.is_active", true)
      .andWhere("courts.club_id", clubId);

    return clubCourts;
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
  async getCourtDetails(courtId: number) {
    try {
      const courtDetails = await db
        .select(
          "courts.court_id",
          "courts.court_name",
          "courts.price_hour_non_subscriber",
          "courts.image as courtImage",
          "courts.opening_time",
          "courts.closing_time",
          "courts.price_hour",
          "courts.is_active",
          "clubs.higher_price_for_non_subscribers",
          "clubs.is_player_subscription_required",
          "clubs.is_player_lesson_subscription_required",
          "clubs.is_trainer_subscription_required",
          "clubs.user_id as clubUserId",
          "clubs.club_id",
          "clubs.club_name",
          "court_surface_types.court_surface_type_name",
          "court_structure_types.court_structure_type_name",
          "locations.location_name"
        )
        .from("courts")
        .leftJoin("clubs", function () {
          this.on("courts.club_id", "=", "clubs.club_id");
        })
        .leftJoin("court_surface_types", function () {
          this.on(
            "court_surface_types.court_surface_type_id",
            "=",
            "courts.court_surface_type_id"
          );
        })
        .leftJoin("court_structure_types", function () {
          this.on(
            "court_structure_types.court_structure_type_id",
            "=",
            "courts.court_structure_type_id"
          );
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "clubs.location_id");
        })
        .where("courts.court_id", courtId);

      return courtDetails;
    } catch (error) {
      console.log("Error fetching selected court details: ", error);
    }
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
  async deactivateClubCourts(clubId) {
    try {
      await db("courts")
        .whereExists(function () {
          this.select("*")
            .from("clubs")
            .whereRaw("clubs.club_id = courts.club_id")
            .andWhere("clubs.club_id", clubId);
        })
        .update({ is_active: false });
      return true;
    } catch (error) {
      console.log("Error updating deleted club courts: ", error);
    }
  },
};

export default courtsModel;
