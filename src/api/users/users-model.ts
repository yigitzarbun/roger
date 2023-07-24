const db = require("../../data/dbconfig");

const usersModel = {
  async getAll() {
    const users = await db("users");
    return users;
  },

  async getByFilter(filter) {
    const user = await db("users").where(filter).first();

    if (user) {
      if (user.user_type_id === 1) {
        const playerDetails = await db("players")
          .where("user_id", user.user_id)
          .first();
        const userDetails = {
          user,
          playerDetails,
        };
        return userDetails;
      } else if (user.user_type_id === 2) {
        const trainerDetails = await db("trainers")
          .where("user_id", user.user_id)
          .first();
        const userDetails = {
          user,
          trainerDetails,
        };
        return userDetails;
      } else if (user.user_type_id === 3) {
        const clubDetails = await db("clubs")
          .where("user_id", user.user_id)
          .first();
        const userDetails = {
          user,
          clubDetails,
        };
        return userDetails;
      }
    }
    return null;
  },
  async getById(user_id) {
    const user = await db("users").where("user_id", user_id);
    return user;
  },

  async add(user) {
    const [newUser] = await db("users").insert(user).returning("*");
    return newUser;
  },

  async update(updates) {
    return await db("users").where("user_id", updates.user_id).update(updates);
  },
};

export default usersModel;
