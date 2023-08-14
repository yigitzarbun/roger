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
