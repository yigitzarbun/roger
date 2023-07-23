const db = require("../../data/dbconfig");

const locationsModel = {
  async getAll() {
    const locations = await db("locations");
    return locations;
  },
};

export default locationsModel;
