const db = require("../../data/dbconfig");

const clubExternalMembersModel = {
  async getAll() {
    const externalMembers = await db("club_external_members");
    return externalMembers;
  },

  async getByFilter(filter) {
    const externalMember = await db("club_external_members")
      .where(filter)
      .first();
    return externalMember;
  },

  async getById(club_external_member_id) {
    const favourite = await db("club_external_members").where(
      "club_external_member_id",
      club_external_member_id
    );
    return favourite;
  },

  async add(externalMember) {
    const [newMember] = await db("club_external_members")
      .insert(externalMember)
      .returning("*");
    return newMember;
  },

  async update(updates) {
    return await db("club_external_members")
      .where("club_external_member_id", updates.club_external_member_id)
      .update(updates);
  },
};

export default clubExternalMembersModel;
