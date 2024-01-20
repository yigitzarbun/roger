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
