const db = require("../../data/dbconfig");

const bookingsModel = {
  async getAll() {
    const bookings = await db("bookings");
    return bookings;
  },

  async getByFilter(filter) {
    const booking = await db("bookings").where(filter).first();
    return booking;
  },

  async getById(booking_id) {
    const booking = await db("bookings").where("booking_id", booking_id);
    return booking;
  },

  async add(booking) {
    const [newBooking] = await db("bookings").insert(booking).returning("*");
    return newBooking;
  },

  async update(updates) {
    return await db("bookings")
      .where("booking_id", updates.booking_id)
      .update(updates);
  },
};

export default bookingsModel;
