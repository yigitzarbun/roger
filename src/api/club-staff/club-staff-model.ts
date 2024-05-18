import { fi } from "date-fns/locale";

const db = require("../../data/dbconfig");

const clubStaffModel = {
  async getAll() {
    const clubStaff = await db
      .select(
        "club_staff.employment_status",
        "club_staff.user_id",
        "club_staff.club_id"
      )
      .from("club_staff");
    return clubStaff;
  },
  async getByFilter(filter) {
    const club_staff = await db
      .select("club_staff.*")
      .from("club_staff")
      .where((builder) => {
        if (filter.user_id) {
          builder.where("user_id", filter.user_id);
        }

        if (filter.club_staff_id) {
          builder.where("club_staff_id", filter.club_staff_id);
        }

        if (filter.club_id) {
          builder.where("club_id", filter.club_id);
        }

        if (filter.employment_status) {
          builder.where("employment_status", filter.employment_status);
        }

        if (filter.club_staff_role_type_id) {
          builder.where(
            "club_staff_role_type_id",
            filter.club_staff_role_type_id
          );
        }
        if (filter.returningStaff) {
          builder
            .where("club_staff.employment_status", "declined")
            .orWhere("club_staff.employment_status", "terminated_by_club");
        }

        if (filter.sortBy) {
          // handle sorting here if required
          builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
        }
      });

    return club_staff;
  },
  async getClubTrainers(userId: number) {
    try {
      const clubTrainers = await db
        .select(
          "club_staff.club_staff_id",
          "club_staff.user_id as clubStaffUserId",
          "trainers.user_id as trainerUserId",
          "trainers.image as trainerImage",
          "trainers.fname",
          "trainers.lname",
          "trainers.birth_year",
          "trainers.gender",
          "locations.location_name",
          "club_staff.employment_status",
          "club_staff.club_staff_role_type_id",
          "trainers.price_hour",
          "trainer_experience_types.trainer_experience_type_name",
          db.raw("COUNT(DISTINCT bookings.booking_id) as lessonCount"),
          db.raw("COUNT(DISTINCT students.student_id) as studentCount")
        )
        .from("club_staff")
        .leftJoin("trainers", function () {
          this.on("trainers.user_id", "=", "club_staff.user_id");
        })
        .leftJoin("clubs", function () {
          this.on("clubs.club_id", "=", "club_staff.club_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "trainers.location_id");
        })

        .leftJoin("bookings", function () {
          this.on("bookings.inviter_id", "=", "trainers.user_id")
            .orOn("bookings.invitee_id", "=", "trainers.user_id")
            .andOn("bookings.booking_status_type_id", 5);
        })
        .leftJoin("students", function () {
          this.on("students.trainer_id", "=", "trainers.user_id")
            .andOn("students.student_status", "=", db.raw("'accepted'"))
            .andOnExists(function () {
              this.select("*")
                .from("users")
                .whereRaw("users.user_id = students.player_id")
                .andWhere("users.user_status_type_id", 1);
            });
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "club_staff.user_id");
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .where("clubs.user_id", userId)
        .andWhere("club_staff.employment_status", "accepted")
        .andWhere("users.user_status_type_id", 1)
        .groupBy(
          "club_staff.club_staff_id",
          "trainers.trainer_id",
          "clubs.club_id",
          "locations.location_id",
          "trainer_experience_types.trainer_experience_type_id"
        );

      return clubTrainers.length > 0 ? clubTrainers : null;
    } catch (error) {
      console.log("Error fetching club trainers: ", error);
    }
  },
  async getClubNewStaffRequests(clubId: number) {
    const newStaffRequests = await db
      .select(
        "club_staff.club_staff_id",
        "club_staff.user_id as clubStaffUserId",
        "trainers.image as trainerImage",
        "trainers.fname",
        "trainers.lname",
        "trainers.birth_year",
        "trainers.gender",
        "trainer_experience_types.trainer_experience_type_name",
        "locations.location_name",
        "club_staff_role_types.club_staff_role_type_name",
        "clubs.club_id",
        "club_staff.club_staff_role_type_id"
      )
      .from("club_staff")
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "club_staff.user_id");
      })
      .leftJoin("trainer_experience_types", function () {
        this.on(
          "trainer_experience_types.trainer_experience_type_id",
          "=",
          "trainers.trainer_experience_type_id"
        );
      })
      .leftJoin("locations", function () {
        this.on("locations.location_id", "=", "trainers.location_id");
      })
      .leftJoin("club_staff_role_types", function () {
        this.on(
          "club_staff_role_types.club_staff_role_type_id",
          "=",
          "club_staff.club_staff_role_type_id"
        );
      })
      .leftJoin("clubs", function () {
        this.on("clubs.club_id", "=", "club_staff.club_id");
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "club_staff.user_id");
      })
      .where("clubs.club_id", clubId)
      .andWhere("club_staff.employment_status", "pending")
      .andWhere("users.user_status_type_id", 1);

    return newStaffRequests;
  },
  async getPaginedClubStaff(filter) {
    const staffPerPage = 4;
    const offset = (filter.currentPage - 1) * staffPerPage;

    const paginatedStaff = await db
      .select(
        "club_staff.club_staff_id",
        "club_staff.user_id as clubStaffUserId",
        "trainers.user_id as trainerUserId",
        "trainers.image as trainerImage",
        "trainers.fname",
        "trainers.lname",
        "trainers.birth_year",
        "trainers.gender",
        "locations.location_name",
        "club_staff_role_types.club_staff_role_type_name",
        "club_staff.employment_status",
        "club_staff.club_staff_role_type_id"
      )
      .from("club_staff")
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "club_staff.user_id");
      })
      .leftJoin("locations", function () {
        this.on("trainers.location_id", "=", "locations.location_id");
      })
      .leftJoin("club_staff_role_types", function () {
        this.on(
          "club_staff_role_types.club_staff_role_type_id",
          "=",
          "club_staff.club_staff_role_type_id"
        );
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "club_staff.user_id");
      })
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("locations.location_id", filter.locationId);
        }
        if (filter.gender !== "") {
          builder.where("trainers.gender", filter.gender);
        }
        if (filter.roleId > 0) {
          builder.where("club_staff.club_staff_role_type_id", filter.roleId);
        }
        if (filter.textSearch !== "") {
          builder.where(function () {
            this.where(
              "trainers.fname",
              "ilike",
              `%${filter.textSearch}%`
            ).orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
          });
        }
      })
      .andWhere("club_staff.club_id", filter.clubId)
      .andWhere("club_staff.employment_status", "accepted")
      .andWhere("users.user_status_type_id", 1)
      .limit(staffPerPage)
      .offset(offset);

    const count = await db
      .select(
        "club_staff.club_staff_id",
        "club_staff.user_id as clubStaffUserId",
        "trainers.user_id as trainerUserId",
        "trainers.image as trainerImage",
        "trainers.fname",
        "trainers.lname",
        "trainers.birth_year",
        "trainers.gender",
        "locations.location_name",
        "club_staff_role_types.club_staff_role_type_name",
        "club_staff.employment_status",
        "club_staff.club_staff_role_type_id"
      )
      .from("club_staff")
      .leftJoin("trainers", function () {
        this.on("trainers.user_id", "=", "club_staff.user_id");
      })
      .leftJoin("locations", function () {
        this.on("trainers.location_id", "=", "locations.location_id");
      })
      .leftJoin("club_staff_role_types", function () {
        this.on(
          "club_staff_role_types.club_staff_role_type_id",
          "=",
          "club_staff.club_staff_role_type_id"
        );
      })
      .leftJoin("users", function () {
        this.on("users.user_id", "=", "club_staff.user_id");
      })
      .where((builder) => {
        if (filter.locationId > 0) {
          builder.where("locations.location_id", filter.locationId);
        }
        if (filter.gender !== "") {
          builder.where("trainers.gender", filter.gender);
        }
        if (filter.roleId > 0) {
          builder.where("club_staff.club_staff_role_type_id", filter.roleId);
        }
        if (filter.textSearch !== "") {
          builder.where(function () {
            this.where(
              "trainers.fname",
              "ilike",
              `%${filter.textSearch}%`
            ).orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
          });
        }
      })
      .andWhere("club_staff.club_id", filter.clubId)
      .andWhere("club_staff.employment_status", "accepted")
      .andWhere("users.user_status_type_id", 1);

    const data = {
      staff: paginatedStaff,
      totalPages: Math.ceil(count.length / staffPerPage),
    };

    return data;
  },
  async getById(club_staff_id) {
    const clubStaff = await db("club_staff").where(
      "club_staff_id",
      club_staff_id
    );
    return clubStaff;
  },
  async isTrainerClubStaff(filter) {
    try {
      const staff = await db("club_staff")
        .where("club_staff.club_id", filter.clubId)
        .andWhere("club_staff.user_id", filter.trainerUserId);
      return staff;
    } catch (error) {
      console.log("Error fetching isTrainerClubStaff: ", error);
    }
  },
  async add(clubStaff) {
    const [newClubStaff] = await db("club_staff")
      .insert(clubStaff)
      .returning("*");
    return newClubStaff;
  },
  async update(updates) {
    return await db("club_staff")
      .where("club_staff_id", updates.club_staff_id)
      .update(updates);
  },
};

export default clubStaffModel;
