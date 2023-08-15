const db = require("../../data/dbconfig");

const clubStaffModel = {
  async getAll() {
    const clubStaff = await db("club_staff");

    return clubStaff;
  },

  async getByFilter(filter) {
    const clubStaff = await db("club_staff").where(filter).first();
    return clubStaff;
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
