import { Request, Response, NextFunction, Router } from "express";

import tournamentsModel from "./tournaments-model";

const tournamentsRouter = Router();

tournamentsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournaments = await tournamentsModel.getAll();
      res.status(200).json(tournaments);
    } catch (error) {
      next(error);
    }
  }
);

tournamentsRouter.get(
  "/club-tournaments/:clubUserId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournaments = await tournamentsModel.getByClubUserId(
        Number(req.params.clubUserId)
      );
      res.status(200).json(tournaments);
    } catch (error) {
      next(error);
    }
  }
);

tournamentsRouter.get(
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const tournaments = await tournamentsModel.getPaginatedTournaments(
        filter
      );
      res.status(200).json(tournaments);
    } catch (error) {
      next(error);
    }
  }
);

tournamentsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTournament = await tournamentsModel.add(req.body);
      res.status(201).json(newTournament);
    } catch (error) {
      next(error);
    }
  }
);

tournamentsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tournamentsModel.update(req.body);
      const updatedTournament = await tournamentsModel.getById(
        req.body.tournamentId
      );
      res.status(200).json(updatedTournament);
    } catch (error) {
      next(error);
    }
  }
);

export default tournamentsRouter;
