import express, { Request, Response } from "express";
import knex from "knex";
import cron from "node-cron";
import knexConfig from "./knexfile";

const { DateTime } = require("luxon");

import usersAuthRouter from "./src/api/users-auth/auth-router";
import usersRouter from "./src/api/users/users-router";
import playersRouter from "./src/api/players/players-router";
import locationsRouter from "./src/api/locations/locations-router";
import playerLevelsRouter from "./src/api/player-levels/player-levels-router";
import userTypesRouter from "./src/api/user-types/user-types-router";
import userStatusTypesRouter from "./src/api/user-status-types/user-status-types-router";
import clubsRouter from "./src/api/clubs/clubs-router";
import clubTypesRouter from "./src/api/club-types/club-types-router";
import trainersRouter from "./src/api/trainers/trainers-router";
import trainerEmploymentTypesRouter from "./src/api/trainer-employment-types/trainer-employment-types-router";
import trainerExperienceTypesRouter from "./src/api/trainer-experience-types/trainer-experience-types-router";
import courtsRouter from "./src/api/courts/courts-router";
import courtStructureTypesRouter from "./src/api/court-structure-types/court-structure-types-router";
import courtSurfaceTypesRouter from "./src/api/court-surface-types/court-surface-types-router";
import bookingsRouter from "./src/api/bookings/bookings-router";
import eventTypesRouter from "./src/api/event-types/event-types-router";
import favouritesRouter from "./src/api/favourites/favourites-router";
import clubSubscriptionTypesRouter from "./src/api/club-subscription-types/club-subscription-types-router";
import clubSubscriptionPackagesRouter from "./src/api/club-subscription-packages/club-subscription-packages-router";
import clubSubscriptionsRouter from "./src/api/club-subscriptions/club-subscriptions-router";
import clubStaffRoleTypesRouter from "./src/api/club-staff-role-types/club-staff-role-types-router";
import clubStaffRouter from "./src/api/club-staff/club-staff-router";
import paymentTypesRouter from "./src/api/payment-types/payment-types-router";
import paymentsRouter from "./src/api/payments/payments-router";
import banksRouter from "./src/api/banks/banks-router";
import matchScoresRouter from "./src/api/match-scores/match-scores-router";
import matchScoresStatusTypesRouter from "./src/api/match-score-status-types/match-scores-status-types-router";
import studentsRouter from "./src/api/students/students-router";
import studentGroupsRouter from "./src/api/student-groups/student-groups-router";

const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

process.env.TZ = "UTC";

const db = knex(knexConfig.development);

cron.schedule("* * * * *", async () => {
  await updatePendingBookings();
  await updatePendingPayments();
  await updateCompletedBookings();
  await updateSubscriptions();
});

async function updatePendingBookings() {
  try {
    const currentDateInUTC = new Date();
    const twentyMinutesAgoInUTC = new Date(
      currentDateInUTC.getTime() - 20 * 60000
    ); // 20 minutes in milliseconds

    await db("bookings")
      .where("booking_status_type_id", "=", 1)
      .where("registered_at", "<", twentyMinutesAgoInUTC.toISOString())
      .update({ booking_status_type_id: 4 });
  } catch (error) {
    console.error("Error updating pending bookings:", error);
  }
}

async function updatePendingPayments() {
  try {
    const currentDateInUTC = new Date();
    const twentyMinutesAgoInUTC = new Date(
      currentDateInUTC.getTime() - 20 * 60000
    ); // 20 minutes in milliseconds

    await db("payments")
      .where("payment_status", "=", "pending")
      .where("registered_at", "<", twentyMinutesAgoInUTC.toISOString())
      .update({ payment_status: "declined" });
  } catch (error) {
    console.error("Error updating pending payments:", error);
  }
}

async function updateCompletedBookings() {
  try {
    const currentDate = DateTime.utc(); // Get the current UTC time using Luxon
    const completedBookings = await db("bookings")
      .where("booking_status_type_id", "=", 2)
      .select();

    for (const booking of completedBookings) {
      const bookingTimestamp = DateTime.fromSQL(
        `${booking.event_date} ${booking.event_time}`,
        { zone: "Europe/Istanbul" } // Replace with the correct timezone
      ).toMillis();

      if (bookingTimestamp <= currentDate.toMillis()) {
        await db("bookings")
          .where("booking_id", "=", booking.booking_id)
          .update({ booking_status_type_id: 5 });
      }
    }
  } catch (error) {
    console.error("Error updating completed bookings:", error);
  }
}

async function updateSubscriptions() {
  try {
    const currentDateInUTC = new Date();
    const currentUTCDate = new Date(
      currentDateInUTC.toISOString().split("T")[0]
    );

    await db("club_subscriptions")
      .where("is_active", true)
      .where("end_date", "<", currentUTCDate)
      .update({ is_active: false });
  } catch (error) {
    console.log("Error updating subscriptions:", error);
  }
}

server.use("/api/usersAuth", usersAuthRouter);
server.use("/api/users", usersRouter);
server.use("/api/players", playersRouter);
server.use("/api/locations", locationsRouter);
server.use("/api/player-levels", playerLevelsRouter);
server.use("/api/user-types", userTypesRouter);
server.use("/api/user-status-types", userStatusTypesRouter);
server.use("/api/clubs", clubsRouter);
server.use("/api/club-types", clubTypesRouter);
server.use("/api/trainers", trainersRouter);
server.use("/api/trainer-employment-types", trainerEmploymentTypesRouter);
server.use("/api/trainer-experience-types", trainerExperienceTypesRouter);
server.use("/api/courts", courtsRouter);
server.use("/api/court-structure-types", courtStructureTypesRouter);
server.use("/api/court-surface-types", courtSurfaceTypesRouter);
server.use("/api/bookings", bookingsRouter);
server.use("/api/event-types", eventTypesRouter);
server.use("/api/favourites", favouritesRouter);
server.use("/api/club-subscription-types", clubSubscriptionTypesRouter);
server.use("/api/club-subscription-packages", clubSubscriptionPackagesRouter);
server.use("/api/club-subscriptions", clubSubscriptionsRouter);
server.use("/api/club-staff-role-types", clubStaffRoleTypesRouter);
server.use("/api/club-staff", clubStaffRouter);
server.use("/api/payment-types", paymentTypesRouter);
server.use("/api/payments", paymentsRouter);
server.use("/api/banks", banksRouter);
server.use("/api/match-scores", matchScoresRouter);
server.use("/api-match-scores-status-types", matchScoresStatusTypesRouter);
server.use("/api/students", studentsRouter);
server.use("/api/student-groups", studentGroupsRouter);

server.get("/", (_req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

export default server;
