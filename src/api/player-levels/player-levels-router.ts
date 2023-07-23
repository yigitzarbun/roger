import { Request, Response, NextFunction, Router } from "express";

import playerLevelsModel from "./player-levels-model";

const playerLevelsRouter = Router();

playerLevelsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerLevels = await playerLevelsModel.getAll();
      res.status(200).json(playerLevels);
    } catch (error) {
      next(error);
    }
  }
);

export default playerLevelsRouter;
