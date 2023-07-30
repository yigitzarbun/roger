const db = require("../../data/dbconfig");

const eventTypesModel = {
  async getAll() {
    const eventTypes = await db("event_types");
    return eventTypes;
  },
};

export default eventTypesModel;
