import { Request, Response, NextFunction, Router } from "express";

import playersModel from "./players-model";

const playersRouter = Router();

playersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const players = await playersModel.getAll();
      res.status(200).json(players);
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.get(
  "/:player_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playersModel.getById(req.params.player_id);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPlayer = await playersModel.add(req.body);
      res.status(201).json(newPlayer);
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await playersModel.update(req.body);
      const updatedPlayer = await playersModel.getById(req.body.player_id);
      res.status(200).json(updatedPlayer);
    } catch (error) {
      next(error);
    }
  }
);
export default playersRouter;
