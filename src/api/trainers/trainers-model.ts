const db = require("../../data/dbconfig");

const trainersModel = {
  async getAll() {
    const trainers = await db("trainers");

    return trainers;
  },

  async getByFilter(filter) {
    const trainers = await db("trainers").where((builder) => {
      if (filter.fname) {
        builder.where("fname", filter.fname);
      }
      if (filter.lname) {
        builder.where("lname", filter.lname);
      }

      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return trainers;
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
