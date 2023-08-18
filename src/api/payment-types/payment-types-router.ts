import { Request, Response, NextFunction, Router } from "express";

import paymentTypesModel from "./payment-types-model";

const paymentTypesRouter = Router();

paymentTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentTypes = await paymentTypesModel.getAll();
      res.status(200).json(paymentTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default paymentTypesRouter;
