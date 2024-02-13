const db = require("../../data/dbconfig");

const clubsModel = {
  async getAll() {
    const clubs = await db("clubs");
    return clubs;
  },
  async getPaginated(filter) {
    const clubsPerPage = 4;
    const offset = (filter.page - 1) * clubsPerPage;

    const paginatedClubs = await db
      .select(
        "clubs.*",
        "clubs.image as clubImage",
        "club_types.*",
        "locations.*",
        db.raw("COUNT(DISTINCT courts.court_id) as courtQuantity"),
        db.raw("COUNT(DISTINCT club_staff.club_staff_id) as staffQuantity"),
        db.raw(
          "COUNT(DISTINCT club_subscriptions.club_subscription_id) as memberQuantity"
        ),
        "users.*"
      )
      .from("clubs")
      .leftJoin(
        "club_types",
        "club_types.club_type_id",
        "=",
        "clubs.club_type_id"
      )
      .leftJoin("locations", "locations.location_id", "=", "clubs.location_id")
      .leftJoin("courts", "courts.club_id", "=", "clubs.club_id")
      .leftJoin("club_staff", "club_staff.club_id", "=", "clubs.club_id")
      .leftJoin("users", "users.user_id", "=", "clubs.user_id")
      .leftJoin(
        "club_subscriptions",
        "club_subscriptions.club_id",
        "=",
        "clubs.user_id"
      )
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("clubs.location_id", filter.locationId);
        }
        if (filter.clubType > 0) {
          builder.where("clubs.club_type_id", filter.clubType);
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
        if (filter.textSearch && filter.textSearch !== "") {
          builder.where("clubs.club_name", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.subscribedClubs === "true") {
          builder.whereIn("clubs.club_id", function () {
            this.select("club_subscriptions.club_id")
              .from("club_subscriptions")
              .where("club_subscriptions.player_id", "=", filter.currentUserId)
              .andWhere("club_subscriptions.is_active", true);
          });
        }
        if (filter.clubTrainers === "true") {
          builder
            .whereNotNull("club_staff.club_staff_id")
            .andWhere("club_staff.club_staff_role_type_id", 2);
        }
      })
      .andWhere("users.user_status_type_id", 1)
      .groupBy(
        "clubs.club_id",
        "club_types.club_type_id",
        "locations.location_id",
        "users.user_id"
      )
      .orderBy("clubs.club_id", "asc")
      .offset(offset)
      .limit(clubsPerPage);

    const totalCountQuery = await db
      .select(
        "clubs.*",
        "clubs.image as clubImage",
        "club_types.*",
        "locations.*",
        db.raw("COUNT(DISTINCT courts.court_id) as courtQuantity"),
        db.raw("COUNT(DISTINCT club_staff.club_staff_id) as staffQuantity"),
        db.raw(
          "COUNT(DISTINCT club_subscriptions.club_subscription_id) as memberQuantity"
        ),
        "users.*"
      )
      .from("clubs")
      .leftJoin(
        "club_types",
        "club_types.club_type_id",
        "=",
        "clubs.club_type_id"
      )
      .leftJoin("locations", "locations.location_id", "=", "clubs.location_id")
      .leftJoin("courts", "courts.club_id", "=", "clubs.club_id")
      .leftJoin("club_staff", "club_staff.club_id", "=", "clubs.club_id")
      .leftJoin("users", "users.user_id", "=", "clubs.user_id")
      .leftJoin(
        "club_subscriptions",
        "club_subscriptions.club_id",
        "=",
        "clubs.user_id"
      )
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("clubs.location_id", filter.locationId);
        }
        if (filter.clubType > 0) {
          builder.where("clubs.club_type_id", filter.clubType);
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
        if (filter.textSearch && filter.textSearch !== "") {
          builder.where("clubs.club_name", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.subscribedClubs === "true") {
          builder.whereIn("clubs.club_id", function () {
            this.select("club_subscriptions.club_id")
              .from("club_subscriptions")
              .where("club_subscriptions.player_id", "=", filter.currentUserId)
              .andWhere("club_subscriptions.is_active", true);
          });
        }
        if (filter.clubTrainers === "true") {
          builder
            .whereNotNull("club_staff.club_staff_id")
            .andWhere("club_staff.club_staff_role_type_id", 2);
        }
      })
      .andWhere("users.user_status_type_id", 1)
      .groupBy(
        "clubs.club_id",
        "club_types.club_type_id",
        "locations.location_id",
        "users.user_id"
      );

    const totalClubs = totalCountQuery.length;

    const enhancedClubs = await Promise.all(
      paginatedClubs.map(async (club) => {
        const isPlayerSubscribed = await db("club_subscriptions")
          .where("club_subscriptions.club_id", "=", club.user_id)
          .andWhere("club_subscriptions.player_id", "=", filter.currentUserId)
          .andWhere("club_subscriptions.is_active", true)
          .first();

        const clubHasSubscriptionPackages = await db(
          "club_subscription_packages"
        )
          .where("club_subscription_packages.club_id", "=", club.user_id)
          .andWhere("club_subscription_packages.is_active", true)
          .first();

        return {
          ...club,
          isPlayerSubscribed,
          clubHasSubscriptionPackages,
        };
      })
    );

    const data = {
      clubs: enhancedClubs,
      totalPages: Math.ceil(totalClubs / clubsPerPage),
    };

    return data;
  },

  async getByFilter(filter) {
    const club = await db("clubs").where(filter).first();
    return club;
  },

  async getByClubId(club_id: number) {
    try {
      const club = await db("clubs").where("club_id", Number(club_id));
      return club;
    } catch (error) {
      console.log(error);
    }
  },

  async getByUserId(user_id) {
    const club = await db("clubs").where("user_id", user_id);
    return club;
  },

  async add(club) {
    const [newClub] = await db("clubs").insert(club).returning("*");
    return newClub;
  },

  async update(updates) {
    return await db("clubs").where("club_id", updates.club_id).update(updates);
  },
};

export default clubsModel;
