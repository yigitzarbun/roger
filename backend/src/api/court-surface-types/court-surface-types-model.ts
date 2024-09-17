const db = require("../../data/dbconfig");

const courtSurfaceTypesModel = {
  async getAll() {
    const courtSurfaceTypes = await db("court_surface_types");
    return courtSurfaceTypes;
  },
};

export default courtSurfaceTypesModel;
