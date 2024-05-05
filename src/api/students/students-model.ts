const db = require("../../data/dbconfig");

const studentsModel = {
  async getAll() {
    const students = await db("students");

    return students;
  },
  async getByFilter(filter) {
    const students = await db("students").where((builder) => {
      if (filter.student_status) {
        builder.where("student_status", filter.student_status);
      }

      if (filter.student_id) {
        builder.where("student_id", filter.student_id);
      }

      if (filter.trainer_id) {
        builder.where("trainer_id", filter.trainer_id);
      }
      if (filter.player_id) {
        builder.where("player_id", filter.player_id);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return students;
  },
  async isStudent(filter) {
    try {
      const isStudent = await db("students")
        .where("player_id", filter.player_id)
        .andWhere("trainer_id", filter.trainer_id)
        .andWhere((builder) =>
          builder
            .where("student_status", "pending")
            .orWhere("student_stauts", "accepted")
        );
      const studentExists = isStudent.length > 0;
      return studentExists;
    } catch (error) {
      console.log("Error checking if player is student: ", error);
    }
  },
  async getPaginatedTrainerStudents(filter) {
    const playersPerPage = filter.perPage;
    const currentPage = filter.currentPageNumber || 1;
    const offset = (currentPage - 1) * playersPerPage;
    try {
      const students = await db
        .select(
          "players.image as playerImage",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.user_id as playerUserId",
          "players.birth_year as playerBirthYear",
          "players.gender",
          "students.*",
          "locations.*",
          "player_levels.*",
          "users.user_status_type_id",
          db.raw(
            "(SELECT COUNT(DISTINCT bookings.booking_id) FROM bookings WHERE (bookings.inviter_id = students.player_id AND bookings.invitee_id = ?) OR (bookings.invitee_id = students.player_id AND bookings.inviter_id = ?) AND bookings.booking_status_type_id = 5 AND bookings.invitee_id = ? AND bookings.inviter_id = ?) as lessonCount",
            [
              filter.trainerUserId,
              filter.trainerUserId,
              filter.trainerUserId,
              filter.trainerUserId,
            ]
          )
        )
        .from("students")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "students.player_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "students.player_id");
        })
        .where((builder) => {
          if (filter.playerLevelId > 0) {
            builder.where("players.player_level_id", filter.playerLevelId);
          }
          if (filter.textSearch && filter.textSearch !== "") {
            builder.where(function () {
              this.where(
                "players.fname",
                "ilike",
                `%${filter.textSearch}%`
              ).orWhere("players.lname", "ilike", `%${filter.textSearch}%`);
            });
          }
          if (filter.locationId > 0) {
            builder.where("players.location_id", filter.locationId);
          }
          if (filter.gender !== "") {
            builder.where("players.gender", filter.gender);
          }
        })
        .andWhere("users.user_status_type_id", 1)
        .andWhere("students.trainer_id", filter.trainerUserId)
        .andWhere("students.student_status", filter.studentStatus)
        .limit(playersPerPage)
        .offset(offset);

      const count = await db
        .countDistinct("bookings.booking_id as lessonCount")
        .from("bookings")
        .leftJoin("players as invitees", function () {
          this.on("invitees.user_id", "=", "bookings.invitee_id");
        })
        .leftJoin("players as inviters", function () {
          this.on("inviters.user_id", "=", "bookings.inviter_id");
        })
        .leftJoin("students", function () {
          this.on(function () {
            this.on("students.player_id", "=", "invitees.user_id").orOn(
              "students.player_id",
              "=",
              "inviters.user_id"
            );
          });
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "students.player_id");
        })
        .where((builder) => {
          builder
            .where(function () {
              this.where(
                "bookings.inviter_id",
                "=",
                filter.trainerUserId
              ).andWhere("bookings.invitee_id", "=", filter.trainerUserId);
            })
            .orWhere(function () {
              this.where(
                "bookings.invitee_id",
                "=",
                filter.trainerUserId
              ).andWhere("bookings.inviter_id", "=", filter.trainerUserId);
            });
        })
        .andWhere("users.user_status_type_id", 1)
        .andWhere("bookings.booking_status_type_id", "=", 5)
        .andWhere((builder) => {
          builder
            .where("students.trainer_id", filter.trainerUserId)
            .andWhere("students.student_status", filter.studentStatus);
        });

      const data = {
        students: students,
        totalPages: Math.ceil(count[0].count / playersPerPage),
      };
      return data;
    } catch (error) {
      console.log("Error fetching trainer students: ", error);
    }
  },
  async getTrainerNewStudentRequestsList(trainerUserId: number) {
    try {
      const newStudentRequests = await db
        .select(
          "students.*",
          "players.user_id as playerUserId",
          "players.fname as playerFname",
          "players.lname as playerLname",
          "players.birth_year as playerBirthYear",
          "players.image as playerImage",
          "players.gender as playerGender",
          "locations.*",
          "player_levels.*"
        )
        .from("students")
        .leftJoin("players", function () {
          this.on("players.user_id", "=", "students.player_id");
        })
        .leftJoin("locations", function () {
          this.on("locations.location_id", "=", "players.location_id");
        })
        .leftJoin("player_levels", function () {
          this.on(
            "player_levels.player_level_id",
            "=",
            "players.player_level_id"
          );
        })
        .leftJoin("users", function () {
          this.on("users.user_id", "=", "students.player_id");
        })
        .where("students.trainer_id", trainerUserId)
        .andWhere("users.user_status_type_id", 1)
        .andWhere("students.student_status", "pending");

      return newStudentRequests;
    } catch (error) {
      console.log("Error fetching trainer new student requests list: ", error);
    }
  },
  async getById(student_id) {
    const student = await db("students").where("student_id", student_id);
    return student;
  },
  async add(student) {
    const [newStudent] = await db("students").insert(student).returning("*");
    return newStudent;
  },
  async update(updates) {
    return await db("students")
      .where("student_id", updates.student_id)
      .update(updates);
  },
};

export default studentsModel;
