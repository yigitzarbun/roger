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
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const clubs = await clubsModel.getPaginated(filter);
      res.status(200).json(clubs);
    } catch (error) {
      next(error);
    }
  }
);

clubsRouter.get(
  "/club/:club_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const club = await clubsModel.getByClubId(Number(req.params.club_id));
      res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }
);
clubsRouter.get(
  "/user/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const club = await clubsModel.getByUserId(req.params.user_id);
      res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }
);
clubsRouter.get(
  "/club-payment-details-exist/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const club = await clubsModel.clubPaymentDetailsExist(
        Number(req.params.user_id)
      );
      res.status(200).json(club);
    } catch (error) {
      next(error);
    }
  }
);
clubsRouter.get(
  "/club-profile-details/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubDetails = await clubsModel.getClubProfileDetails(
        Number(req.params.userId)
      );
      res.status(200).json(clubDetails);
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

      const returningClub = await clubsModel.getByUserId(clubData.user_id);

      if (returningClub.length > 0) {
        clubData.club_id = returningClub?.[0]?.club_id;
        const updatedClub = await clubsModel.update(clubData);
        res.status(201).json(updatedClub);
      } else {
        const newClub = await clubsModel.add(clubData);
        res.status(201).json(newClub);
      }
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
      const updatedClub = await clubsModel.getByClubId(req.body.club_id);
      res.status(200).json(updatedClub);
    } catch (error) {
      next(error);
    }
  }
);
export default clubsRouter;
