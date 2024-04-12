import { Request, Response, NextFunction, Router } from "express";

import clubSubscriptionsModel from "./club-subscriptions-model";

const clubSubscriptionsRouter = Router();

clubSubscriptionsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubSubscriptions = await clubSubscriptionsModel.getAll();
      res.status(200).json(clubSubscriptions);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredClubSubscriptions =
        await clubSubscriptionsModel.getByFilter(filter);
      res.status(200).json(filteredClubSubscriptions);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const subscribers =
        await clubSubscriptionsModel.getPaginatedClubSubscribers(filter);
      res.status(200).json(subscribers);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/players-training-subscription-status/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const playersSubscriptionStatus =
        await clubSubscriptionsModel.getPlayersTrainingSubscriptionStatus(
          filter
        );
      res.status(200).json(playersSubscriptionStatus);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/player-active-club-subscriptions/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptions =
        await clubSubscriptionsModel.getPlayerActiveClubSubscriptionsByUserId(
          Number(req.params.userId)
        );
      res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/club-subscribers/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscribers = await clubSubscriptionsModel.getClubSubscribers(
        Number(req.params.userId)
      );
      res.status(200).json(subscribers);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionsRouter.get(
  "/:club_subscription_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubSubscription = await clubSubscriptionsModel.getById(
        req.params.club_subscription_id
      );
      res.status(200).json(clubSubscription);
    } catch (error) {
      next(error);
    }
  }
);

clubSubscriptionsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newClubSubscription = await clubSubscriptionsModel.add(req.body);
      res.status(201).json(newClubSubscription);
    } catch (error) {
      next(error);
    }
  }
);

clubSubscriptionsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clubSubscriptionsModel.update(req.body);
      const updatedClubSubscription = await clubSubscriptionsModel.getById(
        req.body.club_subscription_id
      );
      res.status(200).json(updatedClubSubscription);
    } catch (error) {
      next(error);
    }
  }
);
export default clubSubscriptionsRouter;
