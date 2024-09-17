const db = require("../../data/dbconfig");

const trainerExperienceTypesModel = {
  async getAll() {
    const trainerExperienceTypes = await db("trainer_experience_types");
    return trainerExperienceTypes;
  },
};

export default trainerExperienceTypesModel;
