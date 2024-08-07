import { Request, Response, NextFunction, Router } from "express";

import tournamentsModel from "./tournaments-model";
import {
  missingTournamentMatcheScores,
  updatePendingTournamentMatchesAsCancelled,
} from "./tournaments-middleware";

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
  "/:tournamentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournaments = await tournamentsModel.getById(
        Number(req.params.tournamentId)
      );
      res.status(200).json(tournaments);
    } catch (error) {
      next(error);
    }
  }
);

tournamentsRouter.get(
  "/tournament-participants-count/:tournamentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const participantCount =
        await tournamentsModel.getParticipantCountByTournamentId(
          Number(req.params.tournamentId)
        );
      res.status(200).json(participantCount);
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
  "/paginated/filter",
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

tournamentsRouter.get(
  "/tournament-details/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const tournament = await tournamentsModel.getTournamentDetails(filter);
      res.status(200).json(tournament);
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

// if tournament is deleted (is_active === false),
// then ongoing matches (bookings) must be updated as bookings.booking_status_type_id === 4

tournamentsRouter.put(
  "/",
  missingTournamentMatcheScores,
  updatePendingTournamentMatchesAsCancelled,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tournamentsModel.update(req.body);
      const updatedTournament = await tournamentsModel.getById(
        req.body.tournament_id
      );
      res.status(200).json(updatedTournament);
    } catch (error) {
      next(error);
    }
  }
);

export default tournamentsRouter;
