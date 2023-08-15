import { Request, Response, NextFunction, Router } from "express";

import clubStaffRoleTypesModel from "./club-staff-role-types-model";

const clubStaffRoleTypesRouter = Router();

clubStaffRoleTypesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubStaffRoleTypes = await clubStaffRoleTypesModel.getAll();
      res.status(200).json(clubStaffRoleTypes);
    } catch (error) {
      next(error);
    }
  }
);

export default clubStaffRoleTypesRouter;
