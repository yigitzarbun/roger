import { Request, Response, NextFunction, Router } from "express";

import studentsModel from "./students-model";

import { studentRequirementsMet } from "./students-middleware";

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
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredStudents = await studentsModel.getByFilter(filter);
      res.status(200).json(filteredStudents);
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.get(
  "/paginated-trainer-students/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredStudents = await studentsModel.getPaginatedTrainerStudents(
        filter
      );
      res.status(200).json(filteredStudents);
    } catch (error) {
      next(error);
    }
  }
);

studentsRouter.get(
  "/is-student/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const isStudent = await studentsModel.isStudent(filter);
      res.status(200).json(isStudent);
    } catch (error) {
      next(error);
    }
  }
);
studentsRouter.get(
  "/trainer-new-student-requests-list/:trainerUserId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await studentsModel.getTrainerNewStudentRequestsList(
        Number(req.params.trainerUserId)
      );
      res.status(200).json(student);
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
  studentRequirementsMet,
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
