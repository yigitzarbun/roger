const db = require("../../data/dbconfig");

const trainersModel = {
  async getAll() {
    const trainers = await db("trainers");

    return trainers;
  },

  async getByFilter(filter) {
    const trainer = await db("trainers").where(filter).first();
    return trainer;
  },

  async getById(trainer_id) {
    const trainer = await db("trainers").where("trainer_id", trainer_id);
    return trainer;
  },

  async add(trainer) {
    const [newTrainer] = await db("trainers").insert(trainer).returning("*");
    return newTrainer;
  },

  async update(updates) {
    return await db("trainers")
      .where("trainer_id", updates.trainer_id)
      .update(updates);
  },
};

export default trainersModel;
