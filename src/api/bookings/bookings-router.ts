import { Request, Response, NextFunction, Router } from "express";

import bookingsModel from "./bookings-model";

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
      const bookings = await bookingsModel.getPlayerBookingsByUserId(filter);
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

bookingsRouter.get(
  "/outgoing-requests/:userId",
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
  "/incoming-requests/:userId",
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
