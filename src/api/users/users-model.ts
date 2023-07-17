const db = require("../../data/dbconfig");

const usersModel = {
  async getAll() {
    const users = await db("users");
    return users;
  },

  async getByFilter(filter) {
    const user = await db("users").where(filter).first();
    return user;
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
