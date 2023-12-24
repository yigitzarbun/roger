const db = require("../../data/dbconfig");

const clubsModel = {
  async getAll() {
    const clubs = await db("clubs");
    return clubs;
  },
  async getPaginated(page) {
    const clubsPerPage = 4;
    const offset = (page - 1) * clubsPerPage;

    const clubs = await db("clubs");

    const paginatedClubs = await db("clubs")
      .orderBy("club_id", "asc")
      .limit(clubsPerPage)
      .offset(offset);

    const data = {
      clubs: paginatedClubs,
      totalPages: Math.ceil(clubs.length / clubsPerPage),
    };
    return data;
  },

  async getByFilter(filter) {
    const club = await db("clubs").where(filter).first();
    return club;
  },

  async getByClubId(club_id: number) {
    try {
      const club = await db("clubs").where("club_id", Number(club_id));
      return club;
    } catch (error) {
      console.log(error);
    }
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
