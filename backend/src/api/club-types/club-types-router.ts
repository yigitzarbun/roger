import { Request, Response, NextFunction, Router } from "express";

import clubTypesModel from "./club-types-model";

const clubTypesRouter = Router();

clubTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubTypes = await clubTypesModel.getAll();
      res.status(200).json(clubTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default clubTypesRouter;
