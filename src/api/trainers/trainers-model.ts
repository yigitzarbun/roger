const db = require("../../data/dbconfig");

const trainersModel = {
  async getAll() {
    const trainers = await db("trainers");
    return trainers;
  },
  async getPaginated(filter) {
    const trainersPerPage = 4;
    const offset = (filter.currentPage - 1) * trainersPerPage;

    const paginatedTrainers = await db
      .distinct("trainers.user_id")
      .select(
        "trainers.trainer_id",
        "trainers.image as trainerImage",
        "trainers.user_id as trainerUserId",
        "trainers.price_hour",
        "trainers.gender",
        "trainers.birth_year",
        "trainers.fname",
        "trainers.lname",
        "locations.*",
        "trainer_experience_types.*",
        db.raw(
          "CASE WHEN club_users.user_status_type_id = 1 THEN clubs.club_name ELSE 'Bağımsız' END as club_name"
        ),
        "club_staff.employment_status"
      )
      .from("trainers")
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
      .leftJoin(
        "users as club_users",
        "club_users.user_id",
        "=",
        "clubs.user_id"
      )
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
      .groupBy(
        "trainers.trainer_id",
        "locations.location_id",
        "trainer_experience_types.trainer_experience_type_id",
        "clubs.club_name",
        "club_staff.employment_status",
        "trainers.user_id",
        "club_users.user_status_type_id"
      )
      .orderBy("trainers.trainer_id", "asc")
      .limit(trainersPerPage)
      .offset(offset);

    const pageCount = await db
      .distinct("trainers.user_id")
      .select(
        "trainers.trainer_id",
        "trainers.image as trainerImage",
        "trainers.user_id as trainerUserId",
        "trainers.price_hour",
        "trainers.gender",
        "trainers.birth_year",
        "trainers.fname",
        "trainers.lname",
        "locations.*",
        "trainer_experience_types.*",
        "clubs.club_name",
        "club_staff.employment_status"
      )
      .from("trainers")
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
      .andWhere("users.user_status_type_id", 1)
      .groupBy(
        "trainers.trainer_id",
        "locations.location_id",
        "trainer_experience_types.trainer_experience_type_id",
        "clubs.club_name",
        "club_staff.employment_status",
        "trainers.user_id"
      );
    const data = {
      trainers: paginatedTrainers,
      totalPages: Math.ceil(pageCount.length / trainersPerPage),
    };
    return data;
  },
  async getByFilter(filter) {
    const trainers = await db
      .select(
        "trainers.user_id",
        "trainers.trainer_id",
        "trainers.fname",
        "trainers.lname"
      )
      .from("trainers")
      .where((builder) => {
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
          "locations.*",
          "trainer_experience_types.*",
          "club_staff.*",
          "users.user_status_type_id",
          "users.email as email",
          db.raw(
            "CASE WHEN club_user.user_status_type_id = 1 THEN clubs.club_name ELSE 'Bağımsız' END club_name"
          ),
          db.raw("COUNT(DISTINCT bookings.booking_id) as lessonCount"),
          db.raw(
            "AVG(CASE WHEN event_reviews.is_active = true THEN event_reviews.review_score ELSE NULL END) as averageReviewScore"
          ),
          db.raw(
            "COUNT(DISTINCT CASE WHEN event_reviews.is_active = true THEN event_reviews.event_review_id ELSE NULL END) as reviewScoreCount"
          ),
          db.raw(
            "COUNT(DISTINCT CASE WHEN students.student_status = 'accepted' AND student_users.user_status_type_id = 1 THEN students.student_id ELSE NULL END) as studentCount"
          )
        )
        .from("trainers")
        .leftJoin("bookings", function () {
          this.on("bookings.inviter_id", "=", "trainers.user_id")
            .orOn("bookings.invitee_id", "=", "trainers.user_id")
            .andOn(function () {
              this.on("bookings.event_type_id", "=", 3)
                .orOn("bookings.event_type_id", "=", 5)
                .orOn("bookings.event_type_id", "=", 6);
            })
            .andOn("bookings.booking_status_type_id", "=", 5);
        })
        .leftJoin("users", "users.user_id", "=", "trainers.user_id")
        .leftJoin(
          "locations",
          "locations.location_id",
          "=",
          "trainers.location_id"
        )
        .leftJoin(
          "trainer_experience_types",
          "trainer_experience_types.trainer_experience_type_id",
          "=",
          "trainers.trainer_experience_type_id"
        )
        .leftJoin("club_staff", "club_staff.user_id", "=", "trainers.user_id")
        .leftJoin("clubs", "clubs.club_id", "=", "trainers.club_id")
        .leftJoin(
          "users as club_user",
          "club_user.user_id",
          "=",
          "clubs.user_id"
        )
        .leftJoin(
          "event_reviews",
          "event_reviews.reviewee_id",
          "=",
          "trainers.user_id"
        )
        .leftJoin("students", "students.trainer_id", "=", "trainers.user_id")
        .leftJoin(
          "users as student_users",
          "students.player_id",
          "=",
          "student_users.user_id"
        )
        .where("users.user_status_type_id", 1)
        .where("trainers.user_id", userId)
        .groupBy(
          "trainers.trainer_id",
          "users.user_id",
          "locations.location_id",
          "trainer_experience_types.trainer_experience_type_id",
          "clubs.club_id",
          "club_staff.club_staff_id",
          "club_staff.club_staff_role_type_id",
          "club_user.user_status_type_id"
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
  async trainerPaymentDetailsExist(userId) {
    try {
      const trainerPaymentDetails = await db("trainers")
        .where("user_id", userId)
        .whereNotNull("iban")
        .whereNotNull("name_on_bank_account")
        .whereNotNull("bank_id")
        .first();

      return !!trainerPaymentDetails;
    } catch (error) {
      console.log("Error fetching trainer payment details: ", error);
      return false;
    }
  },
};

export default trainersModel;
