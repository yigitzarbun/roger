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
          db.raw(
            "MIN(CASE WHEN bookings.booking_status_type_id = 2 THEN bookings.event_date END) as latest_event_date"
          ),
          db.raw(
            "MIN(CASE WHEN bookings.booking_status_type_id = 2 THEN bookings.event_time END) as latest_event_time"
          ),
          "trainers.*",
          "clubs.*",
          "clubs.image as clubImage"
        )
        .from("student_groups")
        .leftJoin(
          "trainers",
          "trainers.user_id",
          "=",
          "student_groups.trainer_id"
        )
        .leftJoin("clubs", "clubs.user_id", "=", "student_groups.club_id")
        .leftJoin(
          "bookings",
          "bookings.invitee_id",
          "=",
          "student_groups.user_id"
        )
        .where("student_groups.is_active", true)
        .andWhere((builder) => {
          builder
            .where("student_groups.first_student_id", userId)
            .orWhere("student_groups.second_student_id", userId)
            .orWhere("student_groups.third_student_id", userId)
            .orWhere("student_groups.fourth_student_id", userId);
        })
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
  async getPaginatedStudentGroups(filter) {
    const groupsPerPage = 4;
    const offset = (filter.page - 1) * groupsPerPage;

    try {
      // Combine the player and external member tables for easier joins
      const studentsSubquery = db
        .select("user_id", "fname", "lname")
        .from("players")
        .unionAll(
          db.select("user_id", "fname", "lname").from("club_external_members")
        )
        .as("students");

      const query = db
        .select(
          "sg.student_group_id",
          "sg.student_group_name",
          "sg.user_id",
          "sg.registered_at",
          "trainers.user_id as trainer_user_id",
          "trainers.fname as trainer_fname",
          "trainers.lname as trainer_lname",
          db.raw(
            "json_agg(json_build_object('user_id', students.user_id, 'name', students.fname || ' ' || students.lname)) as students_info"
          )
        )
        .from({ sg: "student_groups" })
        .leftJoin("trainers", "trainers.user_id", "sg.trainer_id")
        .leftJoin(studentsSubquery, function () {
          this.on("students.user_id", "=", "sg.first_student_id")
            .orOn("students.user_id", "=", "sg.second_student_id")
            .orOn("students.user_id", "=", "sg.third_student_id")
            .orOn("students.user_id", "=", "sg.fourth_student_id");
        })
        .where("sg.club_id", filter.clubUserId)
        .andWhere("sg.is_active", true)
        .groupBy(
          "sg.student_group_id",
          "sg.student_group_name",
          "sg.user_id",
          "sg.registered_at",
          "trainers.user_id",
          "trainers.fname",
          "trainers.lname"
        )
        .limit(groupsPerPage)
        .offset(offset);

      if (filter.textSearch !== "") {
        query.andWhere((builder) => {
          builder
            .orWhere("students.fname", "ilike", `%${filter.textSearch}%`)
            .orWhere("students.lname", "ilike", `%${filter.textSearch}%`)
            .orWhere("trainers.fname", "ilike", `%${filter.textSearch}%`)
            .orWhere("trainers.lname", "ilike", `%${filter.textSearch}%`);
        });
      }

      const groups = await query;
      const count = await db
        .count("* as total")
        .from("student_groups as sg")
        .where("sg.club_id", filter.clubUserId)
        .andWhere("sg.is_active", true);

      const totalPages = Math.ceil(count[0].total / groupsPerPage);

      return { studentGroups: groups, totalPages };
    } catch (error) {
      console.error("Error fetching student groups: ", error);
      throw error; // Rethrow the error to ensure it's caught by the caller
    }
  },
  async getPaginatedTrainerStudentGroups(filter) {
    const groupsPerPage = 4;
    const offset = (filter.page - 1) * groupsPerPage;
    try {
      const query = db
        .select(
          "p1.user_id as student1_user_id",
          "cem1.user_id as cem1_user_id",
          db.raw("COALESCE(p1.fname, cem1.fname) AS student1_fname"),
          db.raw("COALESCE(p1.lname, cem1.lname) AS student1_lname"),
          "p2.user_id as student2_user_id",
          "cem2.user_id as cem2_user_id",
          db.raw("COALESCE(p2.fname, cem2.fname) AS student2_fname"),
          db.raw("COALESCE(p2.lname, cem2.lname) AS student2_lname"),
          "p3.user_id as student3_user_id",
          "cem3.user_id as cem3_user_id",
          db.raw("COALESCE(p3.fname, cem3.fname) AS student3_fname"),
          db.raw("COALESCE(p3.lname, cem3.lname) AS student3_lname"),
          "p4.user_id as student4_user_id",
          "cem4.user_id as cem4_user_id",
          db.raw("COALESCE(p4.fname, cem4.fname) AS student4_fname"),
          db.raw("COALESCE(p4.lname, cem4.lname) AS student4_lname"),
          "sg.student_group_id", // Corrected column name
          "sg.student_group_name", // Corrected column name
          "sg.user_id",
          "sg.registered_at",
          "clubs.club_name as clubName"
        )
        .from({ sg: "student_groups" })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "sg.club_id");
        })
        .leftJoin({ p1: "players" }, "sg.first_student_id", "p1.user_id")
        .leftJoin(
          { cem1: "club_external_members" },
          "sg.first_student_id",
          "cem1.user_id"
        )
        .leftJoin({ p2: "players" }, "sg.second_student_id", "p2.user_id")
        .leftJoin(
          { cem2: "club_external_members" },
          "sg.second_student_id",
          "cem2.user_id"
        )
        .leftJoin({ p3: "players" }, "sg.third_student_id", "p3.user_id")
        .leftJoin(
          { cem3: "club_external_members" },
          "sg.third_student_id",
          "cem3.user_id"
        )
        .leftJoin({ p4: "players" }, "sg.fourth_student_id", "p4.user_id")
        .leftJoin(
          { cem4: "club_external_members" },
          "sg.fourth_student_id",
          "cem4.user_id"
        )
        .andWhere("sg.trainer_id", filter.trainerUserId)
        .andWhere("sg.is_active", true)
        .limit(groupsPerPage)
        .offset(offset);

      if (filter.textSearch !== "") {
        query.andWhere((builder) => {
          builder
            .orWhere("clubs.club_name", "ilike", `%${filter.textSearch}%`)
            .orWhere("sg.student_group_name", "ilike", `%${filter.textSearch}%`)
            .orWhere(
              db.raw("COALESCE(p1.fname, cem1.fname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p1.lname, cem1.lname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p2.fname, cem2.fname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p2.lname, cem2.lname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p3.fname, cem3.fname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p3.lname, cem3.lname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p4.fname, cem4.fname)"),
              "ilike",
              `%${filter.textSearch}%`
            )
            .orWhere(
              db.raw("COALESCE(p4.lname, cem4.lname)"),
              "ilike",
              `%${filter.textSearch}%`
            );
        });
      }

      const groups = await query;

      const count = await db
        .count("* as total")
        .from({ sg: "student_groups" })
        .leftJoin("clubs", function () {
          this.on("clubs.user_id", "=", "sg.club_id");
        })
        .leftJoin({ p1: "players" }, "sg.first_student_id", "p1.user_id")
        .leftJoin(
          { cem1: "club_external_members" },
          "sg.first_student_id",
          "cem1.user_id"
        )
        .leftJoin({ p2: "players" }, "sg.second_student_id", "p2.user_id")
        .leftJoin(
          { cem2: "club_external_members" },
          "sg.second_student_id",
          "cem2.user_id"
        )
        .leftJoin({ p3: "players" }, "sg.third_student_id", "p3.user_id")
        .leftJoin(
          { cem3: "club_external_members" },
          "sg.third_student_id",
          "cem3.user_id"
        )
        .leftJoin({ p4: "players" }, "sg.fourth_student_id", "p4.user_id")
        .leftJoin(
          { cem4: "club_external_members" },
          "sg.fourth_student_id",
          "cem4.user_id"
        )
        .andWhere("sg.trainer_id", filter.trainerUserId)
        .andWhere("sg.is_active", true);

      const totalPage = Math.ceil(count[0].total / groupsPerPage);

      return { studentGroups: groups, totalPages: totalPage };
    } catch (error) {
      console.error("Error fetching trainer student groups: ", error);
      throw error; // Rethrow the error to ensure it's caught by the caller
    }
  },
  async update(updates) {
    return await db("student_groups")
      .where("student_group_id", updates.student_group_id)
      .update(updates);
  },
};

export default studentGroupsModel;
