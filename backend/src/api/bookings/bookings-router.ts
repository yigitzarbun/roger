import { Request, Response, NextFunction, Router } from "express";

import bookingsModel from "./bookings-model";

import {
  essentialRequirementsMet,
  trainingAndMatchConditionsMet,
  lessonConditionsMet,
} from "./bookings-middleware";

const bookingsRouter = Router();

bookingsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getAll();
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredBookings = await bookingsModel.getByFilter(filter);
      res.status(200).json(filteredBookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/get-booked-hours/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const bookedHours = await bookingsModel.getBookedCourtHours(filter);
      res.status(200).json(bookedHours);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/players-leaderboard/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const getPlayersLeaderboard = await bookingsModel.getPlayersLeaderboard(
        filter
      );
      res.status(200).json(getPlayersLeaderboard);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/player-bookings/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const bookings = await bookingsModel.getPlayerCalendarBookingsByFilter(
        filter
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/trainer-bookings/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const bookings = await bookingsModel.getTrainerCalendarBookingsByFilter(
        filter
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/player-outgoing-requests/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getOutgoingPlayerRequests(
        Number(req.params.userId)
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/player-incoming-requests/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getIncomingPlayerRequests(
        Number(req.params.userId)
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/trainer-outgoing-requests/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getOutgoingTrainerRequests(
        Number(req.params.userId)
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/trainer-incoming-requests/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getIncomingTrainerRequests(
        Number(req.params.userId)
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/user-profile-events/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await bookingsModel.getUserProfilePastEvents(
        Number(req.params.userId)
      );
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/past-events/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const bookings = await bookingsModel.getPlayerPastEvents(filter);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/trainer-past-events/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const trainerPastEvents = await bookingsModel.getTrainerPastEvents(
        filter
      );
      res.status(200).json(trainerPastEvents);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/paginated-club-calendar-bookings",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const paginatedBookings =
        await bookingsModel.getPaginatedClubCalendarBookings(filter);
      res.status(200).json(paginatedBookings);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/club-calendar-booked-hours",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const bookedHours = await bookingsModel.getClubCalendarBookedHours(
        filter
      );
      res.status(200).json(bookedHours);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.get(
  "/:booking_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await bookingsModel.getById(
        Number(req.params.booking_id)
      );
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.post(
  "/",
  essentialRequirementsMet,
  trainingAndMatchConditionsMet,
  lessonConditionsMet,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBooking = await bookingsModel.add(req.body);
      res.status(201).json(newBooking);
    } catch (error) {
      next(error);
    }
  }
);
bookingsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await bookingsModel.update(req.body);
      const updatedBooking = await bookingsModel.getById(req.body.booking_id);
      res.status(200).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  }
);
export default bookingsRouter;
