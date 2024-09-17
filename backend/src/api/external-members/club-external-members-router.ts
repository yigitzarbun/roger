import { Request, Response, NextFunction, Router } from "express";

import clubExternalMembersModel from "./club-external-members-model";

const clubExternalMembersRouter = Router();

clubExternalMembersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const externalMembers = await clubExternalMembersModel.getAll();
      res.status(200).json(externalMembers);
    } catch (error) {
      next(error);
    }
  }
);
clubExternalMembersRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const externalMembers = await clubExternalMembersModel.getByFilter(
        filter
      );
      res.status(200).json(externalMembers);
    } catch (error) {
      next(error);
    }
  }
);
clubExternalMembersRouter.get(
  "/:club_external_member_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const externalMember = await clubExternalMembersModel.getById(
        req.params.club_external_member_id
      );
      res.status(200).json(externalMember);
    } catch (error) {
      next(error);
    }
  }
);

clubExternalMembersRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMember = await clubExternalMembersModel.add(req.body);
      res.status(201).json(newMember);
    } catch (error) {
      next(error);
    }
  }
);

clubExternalMembersRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clubExternalMembersModel.update(req.body);
      const updatedMember = await clubExternalMembersModel.getById(
        req.body.club_external_member_id
      );
      res.status(200).json(updatedMember);
    } catch (error) {
      next(error);
    }
  }
);
export default clubExternalMembersRouter;
