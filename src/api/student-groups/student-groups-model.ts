const db = require("../../data/dbconfig");

const studentGroupsModel = {
  async getAll() {
    const studentGroups = await db("student_groups");
    return studentGroups;
  },

  async getByFilter(filter) {
    const studentGroups = await db("student_groups").where((builder) => {
      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }
      if (filter.is_active) {
        builder.where("is_active", filter.is_active);
      }
      if (filter.user_id) {
        builder.where("user_id", filter.user_id);
      }
      if (filter.student_id) {
        builder.where(function () {
          this.where("first_student_id", filter.student_id)
            .orWhere("second_student_id", filter.student_id)
            .orWhere("third_student_id", filter.student_id)
            .orWhere("fourth_student_id", filter.student_id);
        });
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return studentGroups;
  },
  async getPlayerStudentGroupsByUserId(userId: number) {
    try {
      const groups = await db
        .select(
          "student_groups.*",
          db.raw("MIN(bookings.event_date) as latest_event_date"),
          db.raw("MIN(bookings.event_time) as latest_event_time"),
          "trainers.*",
          "clubs.*",
          "clubs.image as club_image"
        )
        .from("student_groups")
        .leftJoin(
          "bookings",
          "bookings.invitee_id",
          "=",
          "student_groups.user_id"
        )
        .leftJoin(
          "trainers",
          "trainers.user_id",
          "=",
          "student_groups.trainer_id"
        )
        .leftJoin("clubs", "clubs.user_id", "=", "student_groups.club_id")
        .where("student_groups.is_active", true)
        .andWhere((builder) => {
          builder
            .where("student_groups.first_student_id", userId)
            .orWhere("student_groups.second_student_id", userId)
            .orWhere("student_groups.third_student_id", userId)
            .orWhere("student_groups.fourth_student_id", userId);
        })
        .andWhere("bookings.booking_status_type_id", 2)
        .groupBy(
          "student_groups.student_group_id",
          "trainers.trainer_id",
          "trainers.user_id",
          "clubs.user_id",
          "clubs.club_id",
          "clubs.image"
        );

      return groups;
    } catch (error) {
      console.error(error);
      throw new Error("Unable to fetch player active groups.");
    }
  },
  async getById(student_group_id) {
    const studentGroup = await db("student_groups").where(
      "student_group_id",
      student_group_id
    );
    return studentGroup;
  },

  async add(studentGroup) {
    const [newStudentGroup] = await db("student_groups")
      .insert(studentGroup)
      .returning("*");
    return newStudentGroup;
  },

  async update(updates) {
    return await db("student_groups")
      .where("student_group_id", updates.student_group_id)
      .update(updates);
  },
};

export default studentGroupsModel;
