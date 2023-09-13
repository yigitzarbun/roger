const db = require("../../data/dbconfig");

const clubsModel = {
  async getAll() {
    const clubs = await db("clubs");

    return clubs;
  },

  async getByFilter(filter) {
    const club = await db("clubs").where(filter).first();
    return club;
  },

  async getByClubId(club_id) {
    const club = await db("clubs").where("club_id", club_id);
    return club;
  },

  async getByUserId(user_id) {
    const club = await db("clubs").where("user_id", user_id);
    return club;
  },

  async add(club) {
    const [newClub] = await db("clubs").insert(club).returning("*");
    return newClub;
  },

  async update(updates) {
    return await db("clubs").where("club_id", updates.club_id).update(updates);
  },
};

export default clubsModel;
