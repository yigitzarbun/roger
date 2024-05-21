import { Request, Response, NextFunction, Router } from "express";

import clubStaffModel from "./club-staff-model";

import { essentialRequirementsMet } from "./club-staff-middleware";

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
  "/is-trainer-staff/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const isTrainerStaff = await clubStaffModel.isTrainerClubStaff(filter);
      res.status(200).json(isTrainerStaff);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.get(
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const paginedStaff = await clubStaffModel.getPaginedClubStaff(filter);
      res.status(200).json(paginedStaff);
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
clubStaffRouter.get(
  "/club-new-staff-requests/:club_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubStaffRequests = await clubStaffModel.getClubNewStaffRequests(
        Number(req.params.club_id)
      );
      res.status(200).json(clubStaffRequests);
    } catch (error) {
      next(error);
    }
  }
);
clubStaffRouter.post(
  "/",
  essentialRequirementsMet,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubStaffData = req.body;
      const returningStaff = await clubStaffModel.getByFilter({
        user_id: Number(clubStaffData.user_id),
        returningStaff: true,
      });
      if (returningStaff.length > 0) {
        clubStaffData.club_staff_id = returningStaff?.[0]?.club_staff_id;
        const updatedStaff = await clubStaffModel.update(clubStaffData);
        res.status(201).json(updatedStaff);
      } else {
        const newClubStaff = await clubStaffModel.add(clubStaffData);
        res.status(201).json(newClubStaff);
      }
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
