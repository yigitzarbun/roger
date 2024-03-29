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
        "courts.*",
        "courts.image as courtImage",
        "clubs.*",
        "court_structure_types.*",
        "court_surface_types.*",
        "locations.*"
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
      .orderBy("court_id", "asc")
      .limit(courtsPerPage)
      .offset(offset);

    const pageCount = await db
      .select(
        "courts.*",
        "courts.image as courtImage",
        "clubs.*",
        "court_structure_types.*",
        "court_surface_types.*",
        "locations.*"
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
      });
    const data = {
      courts: paginatedCourts,
      totalPages: Math.ceil(pageCount.length / courtsPerPage),
    };
    return data;
  },

  async getClubCourtsByClubId(clubId: number) {
    const clubCourts = await db
      .select(
        "courts.*",
        "courts.image as courtImage",
        "clubs.*",
        "court_structure_types.*",
        "court_surface_types.*",
        "locations.*"
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
          "courts.*",
          "courts.image as courtImage",
          "clubs.*",
          "clubs.user_id as clubUserId",
          "court_surface_types.*",
          "court_structure_types.*",
          "locations.*"
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
};

export default courtsModel;
