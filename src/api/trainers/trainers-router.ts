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
  "/paginated",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const trainers = await trainersModel.getPaginated(filter);
      res.status(200).json(trainers);
    } catch (error) {
      next(error);
    }
  }
);
trainersRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredTrainers = await trainersModel.getByFilter(filter);
      res.status(200).json(filteredTrainers);
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.get(
  "/trainer-profile-details/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainerDetails = await trainersModel.getTrainerProfileDetails(
        Number(req.params.userId)
      );
      res.status(200).json(trainerDetails);
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.get(
  "/trainer/:trainer_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainer = await trainersModel.getByTrainerId(req.params.trainer_id);
      res.status(200).json(trainer);
    } catch (error) {
      next(error);
    }
  }
);
trainersRouter.get(
  "/user/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trainer = await trainersModel.getByUserId(req.params.user_id);
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
      const trainerData = req.body;
      if (req.file) {
        trainerData.image = req.file.path;
      }

      const returningTrainer = await trainersModel.getByFilter({
        user_id: Number(trainerData.user_id),
      });

      if (returningTrainer.length > 0) {
        trainerData.trainer_id = returningTrainer?.[0]?.trainer_id;
        let newTrainer = await trainersModel.update(trainerData);
        res.status(201).json(newTrainer);
      } else {
        let newTrainer = await trainersModel.add(trainerData);
        res.status(201).json(newTrainer);
      }
    } catch (error) {
      next(error);
    }
  }
);

trainersRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedTrainerData = req.body;
      if (req.file) {
        updatedTrainerData.image = req.file.path;
      }
      await trainersModel.update(updatedTrainerData);
      const updatedTrainer = await trainersModel.getByTrainerId(
        req.body.trainer_id
      );
      res.status(200).json(updatedTrainer);
    } catch (error) {
      next(error);
    }
  }
);
export default trainersRouter;
