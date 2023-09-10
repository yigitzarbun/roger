const db = require("../../data/dbconfig");

const clubStaffModel = {
  async getAll() {
    const clubStaff = await db("club_staff");

    return clubStaff;
  },

  async getByFilter(filter) {
    const club_staff = await db("club_staff").where((builder) => {
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
      if (filter.user_id) {
        builder.where("user_id", filter.user_id);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return club_staff;
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
