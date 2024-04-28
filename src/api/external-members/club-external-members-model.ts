const db = require("../../data/dbconfig");

const clubExternalMembersModel = {
  async getAll() {
    const externalMembers = await db("club_external_members");
    return externalMembers;
  },

  async getByFilter(filter) {
    const clubExternalMembers = await db
      .select(
        "club_external_members.user_id",
        "club_external_members.fname",
        "club_external_members.lname"
      )
      .from("club_external_members")
      .where((builder) => {
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
      });

    return clubExternalMembers;
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
