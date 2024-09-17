import { Request, Response, NextFunction, Router } from "express";

import courtStructureTypesModel from "./court-structure-types-model";

const courtStructureTypesRouter = Router();

courtStructureTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courtStructureTypes = await courtStructureTypesModel.getAll();
      res.status(200).json(courtStructureTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default courtStructureTypesRouter;
