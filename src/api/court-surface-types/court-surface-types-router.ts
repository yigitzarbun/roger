import { Request, Response, NextFunction, Router } from "express";

import courtSurfaceTypesModel from "./court-surface-types-model";

const courtSurfaceTypesRouter = Router();

courtSurfaceTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courtSurfaceTypes = await courtSurfaceTypesModel.getAll();
      res.status(200).json(courtSurfaceTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default courtSurfaceTypesRouter;
