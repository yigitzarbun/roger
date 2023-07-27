import { Request, Response, NextFunction, Router } from "express";

import trainersModel from "./trainers-model";

const trainersRouter = Router();

trainersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainers = await trainersModel.getAll();
      res.status(200).json(trainers);
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.get(
  "/:trainer_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainer = await trainersModel.getById(req.params.trainer_id);
      res.status(200).json(trainer);
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTrainer = await trainersModel.add(req.body);
      res.status(201).json(newTrainer);
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.put(
  "/:trainer_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await trainersModel.update(req.body);
      const updatedTrainer = await trainersModel.getById(req.body.trainer_id);
      res.status(200).json(updatedTrainer);
    } catch (error) {
      next(error);
    }
  }
);
export default trainersRouter;