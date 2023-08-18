const db = require("../../data/dbconfig");

const paymentsModel = {
  async getAll() {
    const payments = await db("payments");
    return payments;
  },

  async getByFilter(filter) {
    const payment = await db("payments").where(filter).first();
    return payment;
  },

  async getById(payment_id) {
    const payment = await db("payments").where("payment_id", payment_id);
    return payment;
  },

  async add(payment) {
    const [newPayment] = await db("payments").insert(payment).returning("*");
    return newPayment;
  },

  async update(updates) {
    return await db("payments")
      .where("payment_id", updates.payment_id)
      .update(updates);
  },
};

export default paymentsModel;
