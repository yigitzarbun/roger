import { Request, Response, NextFunction, Router } from "express";

import matchScoresStatusTypesModel from "./match-score-status-types-model";

const matchScoresStatusTypesRouter = Router();

matchScoresStatusTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchScoresStatusTypes = await matchScoresStatusTypesModel.getAll();
      res.status(200).json(matchScoresStatusTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default matchScoresStatusTypesRouter;
