const db = require("../../data/dbconfig");

const trainersModel = {
  async getAll() {
    const trainers = await db("trainers");
    return trainers;
  },

  async getPaginated(filter) {
    const trainersPerPage = 4;
    const offset = (filter.currentPage - 1) * trainersPerPage;

    const trainers = await db("trainers");

    const paginatedTrainers = await db("trainers")
      .where((builder) => {
        if (filter.trainerExperienceTypeId > 0) {
          builder.where(
            "trainer_experience_type_id",
            filter.trainerExperienceTypeId
          );
        }
        if (filter.selectedGender !== "") {
          builder.where("gender", filter.selectedGender);
        }
        if (filter.locationId > 0) {
          builder.where("location_id", filter.locationId);
        }
        if (filter.club_id > 0) {
          builder.where("club_id", filter.clubId);
        }
        if (filter.currentUserId) {
          builder.where("user_id", "!=", filter.currentUserId);
        }
      })
      .orderBy("trainer_id", "asc")
      .limit(trainersPerPage)
      .offset(offset);

    const data = {
      trainers: paginatedTrainers,
      totalPages: Math.ceil(trainers.length / trainersPerPage),
    };
    return data;
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

      if (filter.user_id) {
        builder.where("user_id", filter.user_id);
      }

      if (filter.trainer_id) {
        builder.where("trainer_id");
      }

      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return trainers;
  },

  async getByTrainerId(trainer_id) {
    const trainer = await db("trainers").where("trainer_id", trainer_id);
    return trainer;
  },
  async getByUserId(user_id) {
    const trainer = await db("trainers").where("user_id", user_id);
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
