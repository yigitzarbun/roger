import { Request, Response, NextFunction, Router } from "express";

import tournamentMatchesModel from "./tournament-matches-model";

const tournamentMatchesRouter = Router();

tournamentMatchesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matches = await tournamentMatchesModel.getAll();
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  }
);

tournamentMatchesRouter.get(
  "/tournament-matches/:tournamentMatchId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournamentMatches = await tournamentMatchesModel.getById(
        Number(req.params.tournamentMatchId)
      );
      res.status(200).json(tournamentMatches);
    } catch (error) {
      next(error);
    }
  }
);

tournamentMatchesRouter.get(
  "/tournament-matches-by-tournament-id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const tournament = await tournamentMatchesModel.getMatchesByTournamentId(
        filter
      );
      res.status(200).json(tournament);
    } catch (error) {
      next(error);
    }
  }
);

tournamentMatchesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTournamentMatch = await tournamentMatchesModel.add(req.body);
      res.status(201).json(newTournamentMatch);
    } catch (error) {
      next(error);
    }
  }
);

tournamentMatchesRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tournamentMatchesModel.update(req.body);
      const updatedTournamentMatch = await tournamentMatchesModel.getById(
        req.body.tournamentId
      );
      res.status(200).json(updatedTournamentMatch);
    } catch (error) {
      next(error);
    }
  }
);

export default tournamentMatchesRouter;
