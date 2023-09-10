const db = require("../../data/dbconfig");

const bookingsModel = {
  async getAll() {
    const bookings = await db("bookings");
    return bookings;
  },

  async getByFilter(filter) {
    const bookings = await db("bookings").where((builder) => {
      if (filter.booking_id) {
        builder.where("booking_id", filter.booking_id);
      }
      if (filter.event_date) {
        builder.where("event_date", filter.event_date);
      }

      if (filter.event_time) {
        builder.where("event_time", filter.event_time);
      }
      if (filter.booking_status_type_id) {
        builder.where("booking_status_type_id", filter.booking_status_type_id);
      }
      if (filter.event_type_id) {
        builder.where("event_type_id", filter.event_type_id);
      }
      if (filter.club_id) {
        builder.where("club_id", filter.club_id);
      }
      if (filter.court_id) {
        builder.where("court_id", filter.court_id);
      }
      if (filter.inviter_id) {
        builder.where("inviter_id", filter.inviter_id);
      }
      if (filter.invitee_id) {
        builder.where("invitee_id", filter.invitee_id);
      }
      if (filter.sortBy) {
        // handle sorting here if required
        builder.orderBy(filter.sortBy, filter.sortDirection || "asc");
      }
    });

    return bookings;
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
