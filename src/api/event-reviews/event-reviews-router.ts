import { Request, Response, NextFunction, Router } from "express";

import eventReviewsModel from "./event-reviews-model";

const eventReviewsRouter = Router();

eventReviewsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventReviews = await eventReviewsModel.getAll();
      res.status(200).json(eventReviews);
    } catch (error) {
      next(error);
    }
  }
);
eventReviewsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredReviews = await eventReviewsModel.getByFilter(filter);
      res.status(200).json(filteredReviews);
    } catch (error) {
      next(error);
    }
  }
);

eventReviewsRouter.get(
  "/review-details/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const eventReview = await eventReviewsModel.getReviewDetailsByFilter(
        filter
      );
      res.status(200).json(eventReview);
    } catch (error) {
      next(error);
    }
  }
);

eventReviewsRouter.get(
  "/:event_review_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventReview = await eventReviewsModel.getById(
        req.params.event_review_id
      );
      res.status(200).json(eventReview);
    } catch (error) {
      next(error);
    }
  }
);
eventReviewsRouter.get(
  "/player-missing-reviews/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const missingReviews =
        await eventReviewsModel.getPlayerMissingEventReviewsNumber(
          Number(req.params.userId)
        );
      res.status(200).json(missingReviews);
    } catch (error) {
      next(error);
    }
  }
);
eventReviewsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newEventReview = await eventReviewsModel.add(req.body);
      res.status(201).json(newEventReview);
    } catch (error) {
      next(error);
    }
  }
);

eventReviewsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await eventReviewsModel.update(req.body);
      const updatedEventReview = await eventReviewsModel.getById(
        req.body.event_review_id
      );
      res.status(200).json(updatedEventReview);
    } catch (error) {
      next(error);
    }
  }
);
export default eventReviewsRouter;
