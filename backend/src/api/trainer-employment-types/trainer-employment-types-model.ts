const db = require("../../data/dbconfig");

const trainerEmploymentTypesModel = {
  async getAll() {
    const trainerEmploymemtTypes = await db("trainer_employment_types");
    return trainerEmploymemtTypes;
  },
};

export default trainerEmploymentTypesModel;
