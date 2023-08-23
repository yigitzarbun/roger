import { Request, Response, NextFunction, Router } from "express";

import studentsModel from "./students-model";

const studentsRouter = Router();

studentsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await studentsModel.getAll();
      res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.get(
  "/:student_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await studentsModel.getById(req.params.student_id);
      res.status(200).json(student);
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newStudent = await studentsModel.add(req.body);
      res.status(201).json(newStudent);
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await studentsModel.update(req.body);
      const updatedStudent = await studentsModel.getById(req.body.student_id);
      res.status(200).json(updatedStudent);
    } catch (error) {
      next(error);
    }
  }
);
export default studentsRouter;
