import { Request, Response, NextFunction, Router } from "express";

import userStatusTypesModel from "./user-status-types-model";

const userStatusTypesRouter = Router();

userStatusTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userStatusTypes = await userStatusTypesModel.getAll();
      res.status(200).json(userStatusTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default userStatusTypesRouter;
