const db = require("../../data/dbconfig");

const clubsModel = {
  async getAll() {
    const clubs = await db
      .select("clubs.club_id", "clubs.club_name", "clubs.user_id")
      .from("clubs")
      .leftJoin("users", "users.user_id", "clubs.user_id")
      .where("users.user_status_type_id", 1);
    return clubs;
  },
  async getPaginated(filter) {
    const clubsPerPage = 4;
    const offset = (filter.page - 1) * clubsPerPage;

    const paginatedClubs = await db
      .select(
        "clubs.club_id",
        "clubs.user_id",
        "clubs.club_name",
        "clubs.image as clubImage",
        "club_types.club_type_name",
        "locations.location_name",
        db.raw("COUNT(DISTINCT courts.court_id) as courtQuantity"),
        db.raw("COUNT(DISTINCT club_staff.club_staff_id) as staffQuantity"),
        db.raw(
          "COUNT(DISTINCT club_subscriptions.club_subscription_id) as memberQuantity"
        )
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
      .leftJoin("club_staff", function () {
        this.on("club_staff.club_id", "=", "clubs.club_id")
          .andOn("club_staff.employment_status", "=", db.raw("?", ["accepted"]))
          .andOnExists(function () {
            this.select("*")
              .from("users")
              .whereRaw("users.user_id = club_staff.user_id")
              .andWhere("users.user_status_type_id", 1);
          });
      })
      .leftJoin("users", "users.user_id", "=", "clubs.user_id")
      .leftJoin("club_subscriptions", function () {
        this.on("club_subscriptions.club_id", "=", "clubs.user_id")
          .andOn("club_subscriptions.is_active", "=", db.raw("'true'"))
          .andOnExists(function () {
            this.select("*")
              .from("users")
              .whereRaw("users.user_id = club_subscriptions.player_id")
              .andWhere("users.user_status_type_id", 1);
          });
      })
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
          builder
            .where("club_subscriptions.player_id", "=", filter.currentUserId)
            .andWhere("club_subscriptions.is_active", true);
        }
        if (filter.clubTrainers === true) {
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
        "clubs.club_id",
        "clubs.user_id",
        "clubs.club_name",
        "clubs.image as clubImage",
        "club_types.club_type_name",
        "locations.location_name",
        db.raw("COUNT(DISTINCT courts.court_id) as courtQuantity"),
        db.raw("COUNT(DISTINCT club_staff.club_staff_id) as staffQuantity"),
        db.raw(
          "COUNT(DISTINCT club_subscriptions.club_subscription_id) as memberQuantity"
        )
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
      .leftJoin("club_staff", function () {
        this.on("club_staff.club_id", "=", "clubs.club_id").andOn(
          "club_staff.employment_status",
          "=",
          db.raw("?", ["accepted"])
        );
      })

      .leftJoin("users", "users.user_id", "=", "clubs.user_id")
      .leftJoin("club_subscriptions", function () {
        this.on("club_subscriptions.club_id", "=", "clubs.user_id")
          .andOn("club_subscriptions.is_active", "=", db.raw("'true'"))
          .andOnExists(function () {
            this.select("*")
              .from("users")
              .whereRaw("users.user_id = club_subscriptions.player_id")
              .andWhere("users.user_status_type_id", 1);
          });
      })
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

        const isTrainerStaff = await db("club_staff")
          .where("club_staff.club_id", club.club_id)
          .andWhere("club_staff.user_id", filter.currentUserId)
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
          isTrainerStaff,
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
      const club = await db
        .select(
          "clubs.user_id",
          "clubs.club_id",
          "clubs.higher_price_for_non_subscribers",
          "clubs.club_name",
          "clubs.is_player_lesson_subscription_required",
          "clubs.is_trainer_subscription_required",
          "clubs.is_player_subscription_required"
        )
        .from("clubs")
        .where("club_id", Number(club_id));
      return club;
    } catch (error) {
      console.log(error);
    }
  },
  async getByUserId(user_id) {
    const club = await db
      .select(
        "clubs.iban",
        "clubs.name_on_bank_account",
        "clubs.bank_id",
        "clubs.image",
        "clubs.is_player_subscription_required",
        "clubs.is_trainer_subscription_required",
        "clubs.is_player_lesson_subscription_required",
        "clubs.higher_price_for_non_subscribers",
        "clubs.club_address",
        "clubs.club_bio_description",
        "clubs.club_name",
        "clubs.is_premium",
        "clubs.phone_number",
        "clubs.location_id",
        "clubs.club_type_id",
        "clubs.club_id",
        "clubs.user_id"
      )
      .from("clubs")
      .where("user_id", user_id);
    return club;
  },
  async getClubProfileDetails(userId: number) {
    try {
      const clubDetails = await db
        .select(
          "clubs.*",
          "clubs.image as clubImage",
          "users.*",
          "locations.*",
          "club_types.*",
          db.raw("COUNT(DISTINCT courts.court_id) as courtCount"),
          db.raw(
            "COUNT(DISTINCT club_subscription_packages.club_subscription_package_id) as subscriptionPackageCount"
          ),
          db.raw(
            "COUNT(DISTINCT club_subscriptions.club_subscription_id) as subscribersCount"
          ),
          db.raw("COUNT(DISTINCT club_staff.club_staff_id) as staffCount")
        )
        .from("clubs")
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "clubs.user_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "clubs.location_id");
        })
        .leftJoin("club_types", function () {
          this.on("club_types.club_type_id", "=", "clubs.club_type_id");
        })
        .leftJoin("courts", function () {
          this.on("courts.club_id", "=", "clubs.club_id").andOn(
            "courts.is_active",
            "=",
            db.raw("'true'")
          );
        })
        .leftJoin("club_subscription_packages", function () {
          this.on("club_subscription_packages.club_id", "=", userId).andOn(
            "club_subscription_packages.is_active",
            "=",
            db.raw("'true'")
          );
        })
        .leftJoin("club_subscriptions", function () {
          this.on("club_subscriptions.club_id", "=", "clubs.user_id")
            .andOn("club_subscriptions.is_active", "=", db.raw("'true'"))
            .andOnExists(function () {
              this.select("*")
                .from("users")
                .whereRaw("users.user_id = club_subscriptions.player_id")
                .andWhere("users.user_status_type_id", 1);
            });
        })
        .leftJoin("club_staff", function () {
          this.on("club_staff.club_id", "=", "clubs.club_id")
            .andOn("club_staff.club_staff_role_type_id", "=", 2)
            .andOn(
              "club_staff.employment_status",
              "=",
              db.raw("?", ["accepted"])
            )
            .andOnExists(function () {
              this.select("*")
                .from("users")
                .whereRaw("users.user_id = club_staff.user_id")
                .andWhere("users.user_status_type_id", 1);
            });
        })
        .where("clubs.user_id", userId)
        .groupBy(
          "clubs.club_id",
          "users.user_id",
          "locations.location_id",
          "club_types.club_type_id"
        );
      return clubDetails.length > 0 ? clubDetails : null;
    } catch (error) {
      console.log("Error fetching club profile details: ", error);
    }
  },
  async add(club) {
    const [newClub] = await db("clubs").insert(club).returning("*");
    return newClub;
  },
  async update(updates) {
    return await db("clubs").where("club_id", updates.club_id).update(updates);
  },

  async clubPaymentDetailsExist(userId) {
    try {
      const clubPaymentDetails = await db("clubs")
        .where("user_id", userId)
        .whereNotNull("iban")
        .whereNotNull("name_on_bank_account")
        .whereNotNull("bank_id")
        .first();

      return !!clubPaymentDetails;
    } catch (error) {
      console.log("Error fetching club payment details: ", error);
      return false;
    }
  },
};

export default clubsModel;
