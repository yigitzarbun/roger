import { Request, Response, NextFunction, Router } from "express";

import languagesModel from "./languages-model";

const languagesRouter = Router();

languagesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const languages = await languagesModel.getAll();
      res.status(200).json(languages);
    } catch (error) {
      next(error);
    }
  }
);

export default languagesRouter;
