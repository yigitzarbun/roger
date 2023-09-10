import { Request, Response, NextFunction, Router } from "express";

import courtsModel from "./courts-model";

const courtsRouter = Router();

courtsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courts = await courtsModel.getAll();
      res.status(200).json(courts);
    } catch (error) {
      next(error);
    }
  }
);

courtsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredCourts = await courtsModel.getByFilter(filter);
      res.status(200).json(filteredCourts);
    } catch (error) {
      next(error);
    }
  }
);

courtsRouter.get(
  "/:court_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const court = await courtsModel.getById(req.params.court_id);
      res.status(200).json(court);
    } catch (error) {
      next(error);
    }
  }
);

courtsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courtData = req.body;
      if (req.file) {
        courtData.image = req.file.path;
      }
      const newCourt = await courtsModel.add(courtData);
      res.status(201).json(newCourt);
    } catch (error) {
      next(error);
    }
  }
);

courtsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedCourtData = req.body;
      if (req.file) {
        updatedCourtData.image = req.file.path;
      }
      await courtsModel.update(updatedCourtData);
      const updatedCourt = await courtsModel.getById(req.body.court_id);
      res.status(200).json(updatedCourt);
    } catch (error) {
      next(error);
    }
  }
);
export default courtsRouter;
