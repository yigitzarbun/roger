import { Request, Response, NextFunction, Router } from "express";

import locationsModel from "./locations-model";

const locationsRouter = Router();

locationsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await locationsModel.getAll();
      res.status(200).json(locations);
    } catch (error) {
      next(error);
    }
  }
);

export default locationsRouter;
