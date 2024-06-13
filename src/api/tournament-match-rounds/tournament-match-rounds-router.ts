import { Request, Response, NextFunction, Router } from "express";

import tournamentMatchRoundsModel from "./tournament-match-rounds-model";

const tournamentMatchRoundsRouter = Router();

tournamentMatchRoundsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rounds = await tournamentMatchRoundsModel.getAll();
      res.status(200).json(rounds);
    } catch (error) {
      next(error);
    }
  }
);

export default tournamentMatchRoundsRouter;
