const db = require("../../data/dbconfig");

const trainersModel = {
  async getAll() {
    const trainers = await db("trainers");
    return trainers;
  },
  async getPaginated(filter) {
    const trainersPerPage = 4;
    const currentPage = filter.currentPage || 1;
    const offset = (currentPage - 1) * trainersPerPage;

    const trainersQuery = db("trainers")
      .select(
        "trainers.*",
        "trainers.image as trainerImage",
        "trainers.user_id as trainerUserId",
        "locations.*",
        "trainer_experience_types.*",
        "clubs.club_name",
        "club_staff.*"
      )
      .leftJoin(
        "locations",
        "trainers.location_id",
        "=",
        "locations.location_id"
      )
      .leftJoin(
        "trainer_experience_types",
        "trainer_experience_types.trainer_experience_type_id",
        "=",
        "trainers.trainer_experience_type_id"
      )
      .leftJoin("clubs", "clubs.club_id", "=", "trainers.club_id")
      .leftJoin("club_staff", "club_staff.user_id", "=", "trainers.user_id")
      .leftJoin("users", "users.user_id", "=", "trainers.user_id")
      .where((builder) => {
        if (filter.trainerExperienceTypeId > 0) {
          builder.where(
            "trainers.trainer_experience_type_id",
            filter.trainerExperienceTypeId
          );
        }
        if (filter.selectedGender !== "") {
          builder.where("trainers.gender", filter.selectedGender);
        }
        if (filter.locationId > 0) {
          builder.where("trainers.location_id", filter.locationId);
        }
        if (filter.clubId > 0) {
          builder.where("trainers.club_id", filter.clubId);
        }
        if (filter.currentUserId > 0) {
          builder.where("trainers.user_id", "!=", filter.currentUserId);
        }
        if (filter.textSearch && filter.textSearch !== "") {
          builder
            .where("trainers.fname", "ilike", `%${filter.textSearch}%`)
            .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.clubId > 0) {
          builder.whereExists(function () {
            this.select("*")
              .from("club_staff")
              .join("trainers", "club_staff.user_id", "=", "trainers.user_id")
              .andWhere("club_staff.club_id", "=", filter.clubId)
              .andWhere("club_staff.employment_status", "=", "accepted");
          });
        }
      })
      .andWhere("users.user_status_type_id", 1);

    const paginatedTrainers = await trainersQuery
      .orderBy("trainers.trainer_id", "asc")
      .limit(trainersPerPage)
      .offset(offset);

    const totalTrainersCount = await db("trainers")
      .leftJoin("users", "users.user_id", "=", "trainers.user_id")
      .where((builder) => {
        if (filter.trainerExperienceTypeId > 0) {
          builder.where(
            "trainers.trainer_experience_type_id",
            filter.trainerExperienceTypeId
          );
        }
        if (filter.selectedGender !== "") {
          builder.where("trainers.gender", filter.selectedGender);
        }
        if (filter.locationId > 0) {
          builder.where("trainers.location_id", filter.locationId);
        }
        if (filter.clubId > 0) {
          builder.where("trainers.club_id", filter.clubId);
        }
        if (filter.currentUserId > 0) {
          builder.where("trainers.user_id", "!=", filter.currentUserId);
        }
        if (filter.textSearch && filter.textSearch !== "") {
          builder
            .where("trainers.fname", "ilike", `%${filter.textSearch}%`)
            .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
        }
        if (filter.clubId > 0) {
          builder.whereExists(function () {
            this.select("*")
              .from("club_staff")
              .join("trainers", "club_staff.user_id", "=", "trainers.user_id")
              .andWhere("club_staff.club_id", "=", filter.clubId)
              .andWhere("club_staff.employment_status", "=", "accepted");
          });
        }
      })
      .andWhere("users.user_status_type_id", 1)
      .count("trainers.trainer_id as total")
      .first();

    const data = {
      trainers: paginatedTrainers,
      totalPages: Math.ceil(totalTrainersCount.total / trainersPerPage),
    };
    return data;
  },
  async getByFilter(filter) {
    const trainers = await db("trainers").where((builder) => {
      if (filter.fname) {
        builder.where("fname", filter.fname);
      }
      if (filter.lname) {
        builder.where("lname", filter.lname);
      }

      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }

      if (filter.user_id) {
        builder.where("user_id", filter.user_id);
      }

      if (filter.trainer_id) {
        builder.where("trainer_id");
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return trainers;
  },
  async getByTrainerId(trainer_id) {
    const trainer = await db("trainers").where("trainer_id", trainer_id);
    return trainer;
  },
  async getTrainerProfileDetails(userId: number) {
    try {
      const trainerDetails = await db
        .select(
          "trainers.*",
          "trainers.image as trainerImage",
          "trainers.user_id as trainerUserId",
          "trainers.iban as trainerIban",
          "trainers.bank_id as trainerBankId",
          "trainers.name_on_bank_account as trainerBankAccountName",
          "users.*",
          "locations.*",
          "trainer_experience_types.*",
          "clubs.*",
          "club_staff.*",
          db.raw("COUNT(DISTINCT bookings.booking_id) as lessonCount"),
          db.raw("COUNT(DISTINCT students.student_id) as studentCount"),
          db.raw(
            "AVG(CASE WHEN event_reviews.is_active = true THEN event_reviews.review_score ELSE NULL END) as averageReviewScore"
          ),
          db.raw(
            "COUNT(DISTINCT CASE WHEN event_reviews.is_active = true THEN event_reviews.event_review_id ELSE NULL END) as reviewScoreCount"
          )
        )
        .from("trainers")
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "trainers.user_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "trainers.location_id");
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .leftJoin("bookings", function () {
          this.on("bookings.inviter_id", "=", userId)
            .orOn("bookings.invitee_id", "=", userId)
            .andOn(function () {
              this.on(function () {
                this.on("bookings.event_type_id", "=", 3)
                  .orOn("bookings.event_type_id", "=", 5)
                  .orOn("bookings.event_type_id", "=", 6);
              });
            })
            .andOn("bookings.booking_status_type_id", "=", 5);
        })
        .leftJoin("club_staff", function () {
          this.on("club_staff.user_id", "=", userId).andOn(
            "club_staff.employment_status",
            "=",
            db.raw("'accepted'")
          );
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "trainers.club_id");
        })

        .leftJoin("event_reviews", function () {
          this.on("event_reviews.reviewee_id", "=", userId);
        })
        .leftJoin("students", function () {
          this.on("students.trainer_id", "=", userId).andOn(
            "students.student_status",
            "=",
            db.raw("'accepted'")
          );
        })
        .where("trainers.user_id", userId)
        .groupBy(
          "trainers.trainer_id",
          "users.user_id",
          "locations.location_id",
          "trainer_experience_types.trainer_experience_type_id",
          "clubs.club_id",
          "club_staff.club_staff_id",
          "club_staff.club_staff_role_type_id"
        );

      return trainerDetails.length > 0 ? trainerDetails : null;
    } catch (error) {
      console.log("Error fetching trainer profile info: ", error);
    }
  },
  async getByUserId(user_id) {
    const trainer = await db("trainers").where("user_id", user_id);
    return trainer;
  },
  async add(trainer) {
    const [newTrainer] = await db("trainers").insert(trainer).returning("*");
    return newTrainer;
  },
  async update(updates) {
    return await db("trainers")
      .where("trainer_id", updates.trainer_id)
      .update(updates);
  },
};

export default trainersModel;
