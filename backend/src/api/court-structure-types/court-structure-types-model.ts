const db = require("../../data/dbconfig");

const courtStructureTypesModel = {
  async getAll() {
    const courtStructureTypes = await db("court_structure_types");
    return courtStructureTypes;
  },
};

export default courtStructureTypesModel;
