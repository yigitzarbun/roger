import express, { Request, Response } from "express";
import knex from "knex";
import cron from "node-cron";
import path from "path";

import knexConfig from "./knexfile";

import usersAuthRouter from "./api/users-auth/auth-router";
import usersRouter from "./api/users/users-router";
import playersRouter from "./api/players/players-router";
import locationsRouter from "./api/locations/locations-router";
import playerLevelsRouter from "./api/player-levels/player-levels-router";
import userTypesRouter from "./api/user-types/user-types-router";
import userStatusTypesRouter from "./api/user-status-types/user-status-types-router";
import clubsRouter from "./api/clubs/clubs-router";
import clubTypesRouter from "./api/club-types/club-types-router";
import trainersRouter from "./api/trainers/trainers-router";
import trainerEmploymentTypesRouter from "./api/trainer-employment-types/trainer-employment-types-router";
import trainerExperienceTypesRouter from "./api/trainer-experience-types/trainer-experience-types-router";
import courtsRouter from "./api/courts/courts-router";
import courtStructureTypesRouter from "./api/court-structure-types/court-structure-types-router";
import courtSurfaceTypesRouter from "./api/court-surface-types/court-surface-types-router";
import bookingsRouter from "./api/bookings/bookings-router";
import eventTypesRouter from "./api/event-types/event-types-router";
import favouritesRouter from "./api/favourites/favourites-router";
import clubSubscriptionTypesRouter from "./api/club-subscription-types/club-subscription-types-router";
import clubSubscriptionPackagesRouter from "./api/club-subscription-packages/club-subscription-packages-router";
import clubSubscriptionsRouter from "./api/club-subscriptions/club-subscriptions-router";
import clubStaffRoleTypesRouter from "./api/club-staff-role-types/club-staff-role-types-router";
import clubStaffRouter from "./api/club-staff/club-staff-router";
import paymentTypesRouter from "./api/payment-types/payment-types-router";
import paymentsRouter from "./api/payments/payments-router";
import banksRouter from "./api/banks/banks-router";
import matchScoresRouter from "./api/match-scores/match-scores-router";
import matchScoresStatusTypesRouter from "./api/match-score-status-types/match-scores-status-types-router";
import studentsRouter from "./api/students/students-router";
import studentGroupsRouter from "./api/student-groups/student-groups-router";
import clubExternalMembersRouter from "./api/external-members/club-external-members-router";
import eventReviewsRouter from "./api/event-reviews/event-reviews-router";
import languagesRouter from "./api/languages/languages-router";
import messagesRouter from "./api/messages/messages-router";
import tournamentsRouter from "./api/tournaments/tournaments-router";
import tournamentParticipantsRouter from "./api/tournament-participants/tournament-participants-router";
import tournamentMatchesRouter from "./api/tournament-matches/tournament-matches-router";
import tournamentMatchRoundsRouter from "./api/tournament-match-rounds/tournament-match-rounds-router";

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Store files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filenames
  },
});

const upload = multer({ storage: storage });

const cors = require("cors");

const server = express();

server.use(express.json());

const corsOptions = {
  origin: "https://frontend-wispy-log-4260.fly.dev",
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));

// Serve static files from the Uploads directory
server.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

process.env.TZ = "UTC";

const db = knex(knexConfig.production);

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
    // TO DO: Make 3 hours dynamic
    const timezoneOffsetHours = 3;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + timezoneOffsetHours);
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + timezoneOffsetHours);

    const completedBookings = await db("bookings")
      .where("booking_status_type_id", "=", 2)
      .select();

    for (const booking of completedBookings) {
      const bookingDate = new Date(booking.event_date);
      //bookingDate.setHours(bookingDate.getHours() + timezoneOffsetHours);

      // Parse booking.event_time
      const eventTimeParts = booking.event_time.split(":");
      const bookingTime = new Date();
      bookingTime.setHours(Number(eventTimeParts[0]));
      bookingTime.setMinutes(Number(eventTimeParts[1]));
      bookingTime.setSeconds(Number(eventTimeParts[2]));

      // Compare the adjusted dates and times
      if (bookingDate <= currentDate && bookingTime <= currentTime) {
        await db("bookings")
          .where("booking_id", "=", booking.booking_id)
          .update({ booking_status_type_id: 5 });

        await db("event_reviews").insert({
          booking_id: booking.booking_id,
          reviewer_id: booking.inviter_id,
          reviewee_id: booking.invitee_id,
          event_review_title: "",
          event_review_description: "",
          review_score: 0,
          is_active: false,
          registered_at: new Date(),
        });

        await db("event_reviews").insert({
          booking_id: booking.booking_id,
          reviewer_id: booking.invitee_id,
          reviewee_id: booking.inviter_id,
          event_review_title: "",
          event_review_description: "",
          review_score: 0,
          is_active: false,
          registered_at: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error updating completed bookings:", error);
  }
}

//To do: adjust time & date
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

server.use("/api/players", upload.single("image"), playersRouter);
server.use("/api/trainers", upload.single("image"), trainersRouter);
server.use("/api/clubs", upload.single("image"), clubsRouter);
server.use("/api/courts", upload.single("image"), courtsRouter);
server.use("/api/usersAuth", usersAuthRouter);
server.use("/api/users", usersRouter);
server.use("/api/locations", locationsRouter);
server.use("/api/player-levels", playerLevelsRouter);
server.use("/api/user-types", userTypesRouter);
server.use("/api/user-status-types", userStatusTypesRouter);
server.use("/api/club-types", clubTypesRouter);
server.use("/api/trainer-employment-types", trainerEmploymentTypesRouter);
server.use("/api/trainer-experience-types", trainerExperienceTypesRouter);
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
server.use("/api/club-external-members", clubExternalMembersRouter);
server.use("/api/event-reviews", eventReviewsRouter);
server.use("/api/languages", languagesRouter);
server.use("/api/messages", messagesRouter);
server.use("/api/tournaments", tournamentsRouter);
server.use("/api/tournament-participants", tournamentParticipantsRouter);
server.use("/api/tournament-matches", tournamentMatchesRouter);
server.use("/api/tournament-match-rounds", tournamentMatchRoundsRouter);

server.get("/", (_req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

export default server;
