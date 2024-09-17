const db = require("../../data/dbconfig");

const paymentTypesModel = {
  async getAll() {
    const paymentTypes = await db("payment_types");
    return paymentTypes;
  },
};

export default paymentTypesModel;
