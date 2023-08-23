const db = require("../../data/dbconfig");

const studentsModel = {
  async getAll() {
    const students = await db("students");

    return students;
  },

  async getByFilter(filter) {
    const student = await db("students").where(filter).first();
    return student;
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
