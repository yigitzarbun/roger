import { Request, Response, NextFunction, Router } from "express";

import trainerExperienceTypesModel from "./trainer-experience-types-model";

const trainerExperienceTypesRouter = Router();

trainerExperienceTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainerExperienceTypes = await trainerExperienceTypesModel.getAll();
      res.status(200).json(trainerExperienceTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default trainerExperienceTypesRouter;
