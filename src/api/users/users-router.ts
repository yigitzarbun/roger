import { Request, Response, NextFunction, Router } from "express";

import usersModel from "./users-model";

const usersRouter = Router();

usersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await usersModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await usersModel.getById(req.params.user_id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/email/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await usersModel.getByFilter({ email });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

usersRouter.put(
  "/:user_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await usersModel.update(req.body);
      const updatedUser = await usersModel.getById(req.body.user_id);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);
export default usersRouter;
