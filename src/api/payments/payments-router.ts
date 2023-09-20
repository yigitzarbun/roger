import { Request, Response, NextFunction, Router } from "express";

import paymentsModel from "./payments-model";

const paymentsRouter = Router();

paymentsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await paymentsModel.getAll();
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }
);

paymentsRouter.get(
  "/:payment_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await paymentsModel.getById(req.params.payment_id);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }
);
paymentsRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredPayments = await paymentsModel.getByFilter(filter);
      res.status(200).json(filteredPayments);
    } catch (error) {
      next(error);
    }
  }
);
paymentsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPayment = await paymentsModel.add(req.body);
      res.status(201).json(newPayment);
    } catch (error) {
      next(error);
    }
  }
);

paymentsRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await paymentsModel.update(req.body);
      const updatedPayment = await paymentsModel.getById(req.body.payment_id);
      res.status(200).json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }
);
export default paymentsRouter;
