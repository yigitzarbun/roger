const db = require("../../data/dbconfig");

const usersModel = {
  async getAll() {
    const users = await db("users");
    return users;
  },

  async getUserByEmail(email: string) {
    try {
      const user = await db("users").where("email", email);
      return user;
    } catch (error) {
      console.log("Error fetching user by email: ", error);
    }
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
      } else if (user.user_type_id === 4) {
        const clubStaffDetails = await db("club_staff")
          .where("user_id", user.user_id)
          .first();
        const userDetails = {
          user,
          clubStaffDetails,
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
    const [updatedUser] = await db("users")
      .where("user_id", updates.user_id)
      .update(updates)
      .returning("*");
    return updatedUser;
  },
};

export default usersModel;
