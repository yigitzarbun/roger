import { Request, Response, NextFunction, Router } from "express";

import trainerEmploymentTypesModel from "./trainer-employment-types-model";

const trainerEmploymentTypesRouter = Router();

trainerEmploymentTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainerEmploymentTypes = await trainerEmploymentTypesModel.getAll();
      res.status(200).json(trainerEmploymentTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default trainerEmploymentTypesRouter;
