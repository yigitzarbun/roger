import { Request, Response, NextFunction, Router } from "express";

import tournamentParticipantsModel from "./tournament-participants-model";

const tournamentParticipantsRouter = Router();

tournamentParticipantsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const participants = await tournamentParticipantsModel.getAll();
      res.status(200).json(participants);
    } catch (error) {
      next(error);
    }
  }
);

tournamentParticipantsRouter.get(
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const tournaments =
        await tournamentParticipantsModel.getPaginatedPlayerActiveTournaments(
          filter
        );
      res.status(200).json(tournaments);
    } catch (error) {
      next(error);
    }
  }
);

tournamentParticipantsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newParticipant = await tournamentParticipantsModel.add(req.body);
      res.status(201).json(newParticipant);
    } catch (error) {
      next(error);
    }
  }
);

tournamentParticipantsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await tournamentParticipantsModel.update(req.body);
      const updatedTournament = await tournamentParticipantsModel.getById(
        req.body.tournamentParticipantId
      );
      res.status(200).json(updatedTournament);
    } catch (error) {
      next(error);
    }
  }
);

export default tournamentParticipantsRouter;
