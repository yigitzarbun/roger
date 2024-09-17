import { Request, Response, NextFunction, Router } from "express";

import eventTypesModel from "./event-types-model";

const eventTypesRouter = Router();

eventTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventTypes = await eventTypesModel.getAll();
      res.status(200).json(eventTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default eventTypesRouter;
