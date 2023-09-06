import { Request, Response, NextFunction, Router } from "express";

import clubsModel from "./clubs-model";

const clubsRouter = Router();

clubsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubs = await clubsModel.getAll();
      res.status(200).json(clubs);
    } catch (error) {
      next(error);
    }
  }
);

clubsRouter.get(
  "/:club_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const club = await clubsModel.getById(req.params.club_id);
      res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }
);

clubsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubData = req.body;
      if (req.file) {
        clubData.image = req.file.path;
      }
      const newClub = await clubsModel.add(clubData);
      res.status(201).json(newClub);
    } catch (error) {
      next(error);
    }
  }
);

clubsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedClubData = req.body;
      if (req.file) {
        updatedClubData.image = req.file.path;
      }
      await clubsModel.update(updatedClubData);
      const updatedClub = await clubsModel.getById(req.body.club_id);
      res.status(200).json(updatedClub);
    } catch (error) {
      next(error);
    }
  }
);
export default clubsRouter;
