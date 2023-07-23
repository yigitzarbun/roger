import { Request, Response, NextFunction, Router } from "express";

import userTypesModel from "./user-types-model";

const userTypesRouter = Router();

userTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userTypes = await userTypesModel.getAll();
      res.status(200).json(userTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default userTypesRouter;
