const db = require("../../data/dbconfig");

const courtsModel = {
  async getAll() {
    const courts = await db("courts");
    return courts;
  },
  async getPaginated(filter) {
    const courtsPerPage = 4;
    const offset = (filter.page - 1) * courtsPerPage;

    const allCourts = await db
      .select(
        "courts.court_id",
        "courts.image as courtImage",
        "courts.court_name",
        "courts.opening_time",
        "courts.closing_time",
        "courts.price_hour",
        "courts.is_active",
        "clubs.location_id",
        "courts.price_hour_non_subscriber",
        "clubs.higher_price_for_non_subscribers",
        "clubs.club_name",
        "court_structure_types.court_structure_type_name",
        "court_surface_types.court_surface_type_name",
        "court_structure_types.court_structure_type_id",
        "court_surface_types.court_surface_type_id",
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

    const courtsWithScores = allCourts.map((court) => {
      let proximityScore: number = 0;
      proximityScore = getProximityScore(
        court.location_id,
        filter.proximityLocationId
      );

      return {
        ...court,
        relevance_score: proximityScore,
      };
    });

    courtsWithScores.sort((a, b) => {
      if (filter.column !== "") {
        if (filter.column === "court_name") {
          // String comparison for court_name
          if (filter.direction === "desc") {
            return b.court_name.localeCompare(a.court_name);
          } else {
            return a.court_name.localeCompare(b.court_name);
          }
        } else if (filter.column === "club_name") {
          // String comparison for club_name
          if (filter.direction === "desc") {
            return b.club_name.localeCompare(a.club_name);
          } else {
            return a.club_name.localeCompare(b.club_name);
          }
        } else {
          // Numeric comparison for other columns
          if (filter.direction === "desc") {
            return b[filter.column] - a[filter.column];
          } else {
            return a[filter.column] - b[filter.column];
          }
        }
      }
      if (b.relevance_score !== a.relevance_score) {
        return b.relevance_score - a.relevance_score;
      }
      return a.player_id - b.player_id;
    });

    const paginatedCourts = courtsWithScores.slice(
      offset,
      offset + courtsPerPage
    );

    const totalPages = Math.ceil(courtsWithScores.length / courtsPerPage);

    const data = {
      courts: paginatedCourts,
      totalPages: totalPages,
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

function getProximityScore(courtLocationId, filterProximityLocationId) {
  const locationProximityMap = {
    1: [1, 8, 10, 11, 12],
    2: [2, 7, 8, 11],
    3: [3, 4, 6, 9, 17],
    4: [4, 3, 6, 8, 9],
    5: [5, 7, 8, 13, 14, 15, 16],
    6: [6, 3, 4, 9, 13, 14],
    7: [7, 5, 8, 10],
    8: [8, 1, 2, 4, 10, 11, 16],
    9: [9, 4, 6, 13, 14],
    10: [10, 1, 2, 8, 11, 12],
    11: [11, 1, 2, 8, 10, 12],
    12: [12, 1, 2, 8, 10, 11],
    13: [13, 3, 4, 9, 14, 17],
    14: [14, 3, 4, 6, 9, 13, 17],
    15: [15, 5, 7, 8, 10, 11, 12, 16],
    16: [16, 2, 5, 7, 8, 15],
    17: [17, 3, 4, 6, 9, 13, 14],
  };

  // Check if courtLocationId and filterProximityLocationId are the same
  if (Number(courtLocationId) === Number(filterProximityLocationId)) {
    return 3;
  }

  // Check if there's a proximity match in locationProximityMap
  const proximityList = locationProximityMap[filterProximityLocationId] || [];

  if (proximityList.includes(courtLocationId)) {
    return 1;
  } else {
    return 0;
  }
}
export default courtsModel;
