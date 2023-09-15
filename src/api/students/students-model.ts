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

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return students;
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
