import { Request, Response, NextFunction, Router } from "express";

import banksModel from "./banks-model";

const banksRouter = Router();

banksRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const banks = await banksModel.getAll();
      res.status(200).json(banks);
    } catch (error) {
      next(error);
    }
  }
);

export default banksRouter;
