import { Request, Response, NextFunction, Router } from "express";

import matchScoresModel from "./match-scores-model";

const matchScoresRouter = Router();

matchScoresRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchScores = await matchScoresModel.getAll();
      res.status(200).json(matchScores);
    } catch (error) {
      next(error);
    }
  }
);

matchScoresRouter.get(
  "/:match_score_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchScore = await matchScoresModel.getById(
        req.params.match_score_id
      );
      res.status(200).json(matchScore);
    } catch (error) {
      next(error);
    }
  }
);

matchScoresRouter.get(
  "/match-scores-booking-details/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scores =
        await matchScoresModel.getPlayerMatchScoresWithBookingDetails(
          Number(req.params.userId)
        );
      res.status(200).json(scores);
    } catch (error) {
      next(error);
    }
  }
);

matchScoresRouter.get(
  "/missing-match-scores/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scores = await matchScoresModel.getPlayerMissingMatchScoreNumbers(
        Number(req.params.userId)
      );
      res.status(200).json(scores);
    } catch (error) {
      next(error);
    }
  }
);
matchScoresRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMatchScore = await matchScoresModel.add(req.body);
      res.status(201).json(newMatchScore);
    } catch (error) {
      next(error);
    }
  }
);

matchScoresRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await matchScoresModel.update(req.body);
      const updatedMatchScore = await matchScoresModel.getById(
        req.body.match_score_id
      );
      res.status(200).json(updatedMatchScore);
    } catch (error) {
      next(error);
    }
  }
);
export default matchScoresRouter;
