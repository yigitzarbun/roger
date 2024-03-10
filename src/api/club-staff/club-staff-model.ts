const db = require("../../data/dbconfig");

const clubStaffModel = {
  async getAll() {
    const clubStaff = await db("club_staff");

    return clubStaff;
  },

  async getByFilter(filter) {
    const club_staff = await db("club_staff").where((builder) => {
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
          "club_staff.*",
          "trainers.*",
          "trainers.user_id as trainerUserId",
          "trainers.image as trainerImage",
          "clubs.*",
          "locations.*",
          "trainer_experience_types.*",
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
          this.on("students.trainer_id", "=", "trainers.user_id").andOn(
            "students.student_status",
            "=",
            db.raw("'accepted'")
          );
        })
        .leftJoin("trainer_experience_types", function () {
          this.on(
            "trainer_experience_types.trainer_experience_type_id",
            "=",
            "trainers.trainer_experience_type_id"
          );
        })
        .where("clubs.user_id", userId)
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
  async getById(club_staff_id) {
    const clubStaff = await db("club_staff").where(
      "club_staff_id",
      club_staff_id
    );
    return clubStaff;
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
