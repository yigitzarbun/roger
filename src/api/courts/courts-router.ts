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
      const newCourt = await courtsModel.add(req.body);
      res.status(201).json(newCourt);
    } catch (error) {
      next(error);
    }
  }
);

courtsRouter.put(
  "/:court_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await courtsModel.update(req.body);
      const updatedCourt = await courtsModel.getById(req.body.court_id);
      res.status(200).json(updatedCourt);
    } catch (error) {
      next(error);
    }
  }
);
export default courtsRouter;