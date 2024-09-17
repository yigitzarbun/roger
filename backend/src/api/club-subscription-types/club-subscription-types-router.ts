import { Request, Response, NextFunction, Router } from "express";

import clubSubscriptionTypesModel from "./club-subscription-types-model";

const clubSubscriptionTypesRouter = Router();

clubSubscriptionTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubSubscriptionTypes = await clubSubscriptionTypesModel.getAll();
      res.status(200).json(clubSubscriptionTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default clubSubscriptionTypesRouter;
