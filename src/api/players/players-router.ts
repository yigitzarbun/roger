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
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const paginatedPlayers = await playersModel.getPaginated(filter);
      res.status(200).json(paginatedPlayers);
    } catch (error) {
      next(error);
    }
  }
);
playersRouter.get(
  "/player-profile-details/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerDetails = await playersModel.getPlayerProfile(
        Number(req.params.userId)
      );
      res.status(200).json(playerDetails);
    } catch (error) {
      next(error);
    }
  }
);
playersRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredPlayers = await playersModel.getByFilter(filter);
      res.status(200).json(filteredPlayers);
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.get(
  "/player/:player_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playersModel.getByPlayerId(req.params.player_id);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  }
);
playersRouter.get(
  "/user/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playersModel.getByUserId(req.params.user_id);
      res.status(200).json(player);
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.get(
  "/player-payment-details-exist/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await playersModel.playerPaymentDetailsExist(
        Number(req.params.user_id)
      );
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
      const playerData = req.body;
      if (req.file) {
        playerData.image = req.file.path;
      }
      const returningPlayer = await playersModel.getByUserId(
        Number(playerData.user_id)
      );
      if (returningPlayer.length > 0) {
        playerData.player_id = returningPlayer?.[0]?.player_id;
        const updatedPlayer = await playersModel.update(playerData);
        res.status(201).json(updatedPlayer);
      } else {
        const newPlayer = await playersModel.add(playerData);
        res.status(201).json(newPlayer);
      }
    } catch (error) {
      next(error);
    }
  }
);

playersRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedPlayerData = req.body;
      if (req.file) {
        updatedPlayerData.image = req.file.path;
      }
      await playersModel.update(updatedPlayerData);
      const updatedPlayer = await playersModel.getByPlayerId(
        req.body.player_id
      );
      res.status(200).json(updatedPlayer);
    } catch (error) {
      next(error);
    }
  }
);
export default playersRouter;
