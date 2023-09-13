import { Request, Response, NextFunction, Router } from "express";

import favouritesModel from "./favourites-model";

const favouritesRouter = Router();

favouritesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favourites = await favouritesModel.getAll();
      res.status(200).json(favourites);
    } catch (error) {
      next(error);
    }
  }
);
favouritesRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredFavourites = await favouritesModel.getByFilter(filter);
      res.status(200).json(filteredFavourites);
    } catch (error) {
      next(error);
    }
  }
);
favouritesRouter.get(
  "/:favourite_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favourite = await favouritesModel.getById(req.params.favourite_id);
      res.status(200).json(favourite);
    } catch (error) {
      next(error);
    }
  }
);

favouritesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newFavourite = await favouritesModel.add(req.body);
      res.status(201).json(newFavourite);
    } catch (error) {
      next(error);
    }
  }
);

favouritesRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await favouritesModel.update(req.body);
      const updatedFavourite = await favouritesModel.getById(
        req.body.favourite_id
      );
      res.status(200).json(updatedFavourite);
    } catch (error) {
      next(error);
    }
  }
);
export default favouritesRouter;
