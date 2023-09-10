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

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
      if (filter.student_id) {
        builder.where(function () {
          this.where("first_student_id", filter.student_id)
            .orWhere("second_student_id", filter.student_id)
            .orWhere("third_student_id", filter.student_id)
            .orWhere("fourth_student_id", filter.student_id);
        });
      }
    });

    return studentGroups;
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
