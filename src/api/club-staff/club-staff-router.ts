import { Request, Response, NextFunction, Router } from "express";

import clubStaffModel from "./club-staff-model";

const clubStaffRouter = Router();

clubStaffRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubStaff = await clubStaffModel.getAll();
      res.status(200).json(clubStaff);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredStaff = await clubStaffModel.getByFilter(filter);
      res.status(200).json(filteredStaff);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.get(
  "/:club_staff_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubStaff = await clubStaffModel.getById(req.params.club_staff_id);
      res.status(200).json(clubStaff);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.get(
  "/club-trainers/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubTrainers = await clubStaffModel.getClubTrainers(
        Number(req.params.userId)
      );
      res.status(200).json(clubTrainers);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newClubStaff = await clubStaffModel.add(req.body);
      res.status(201).json(newClubStaff);
    } catch (error) {
      next(error);
    }
  }
);

clubStaffRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clubStaffModel.update(req.body);
      const updatedClubStaff = await clubStaffModel.getById(
        req.body.club_staff_id
      );
      res.status(200).json(updatedClubStaff);
    } catch (error) {
      next(error);
    }
  }
);
export default clubStaffRouter;
