import { Request, Response, NextFunction, Router } from "express";

import studentGroupsModel from "./student-groups-model";

const studentGroupsRouter = Router();

studentGroupsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentGroups = await studentGroupsModel.getAll();
      res.status(200).json(studentGroups);
    } catch (error) {
      next(error);
    }
  }
);

studentGroupsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredGroups = await studentGroupsModel.getByFilter(filter);
      res.status(200).json(filteredGroups);
    } catch (error) {
      next(error);
    }
  }
);

studentGroupsRouter.get(
  "/player-active-student-groups/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await studentGroupsModel.getPlayerStudentGroupsByUserId(
        Number(req.params.userId)
      );
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  }
);

studentGroupsRouter.get(
  "/:student_group_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentGroup = await studentGroupsModel.getById(
        req.params.student_group_id
      );
      res.status(200).json(studentGroup);
    } catch (error) {
      next(error);
    }
  }
);

studentGroupsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newStudentGroup = await studentGroupsModel.add(req.body);
      res.status(201).json(newStudentGroup);
    } catch (error) {
      next(error);
    }
  }
);

studentGroupsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await studentGroupsModel.update(req.body);
      const updatedStudentGroup = await studentGroupsModel.getById(
        req.body.student_group_id
      );
      res.status(200).json(updatedStudentGroup);
    } catch (error) {
      next(error);
    }
  }
);
export default studentGroupsRouter;
