import { Request, Response, NextFunction, Router } from "express";

import clubSubscriptionPackagesModel from "./club-subscription-packages-model";

const clubSubscriptionPackagesRouter = Router();

clubSubscriptionPackagesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubSubscriptionPackages =
        await clubSubscriptionPackagesModel.getAll();
      res.status(200).json(clubSubscriptionPackages);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionPackagesRouter.get(
  "/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const filteredClubSubscriptionPackage =
        await clubSubscriptionPackagesModel.getByFilter(filter);
      res.status(200).json(filteredClubSubscriptionPackage);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionPackagesRouter.get(
  "/club-subscription-package-details/filter",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const clubSubscriptionPackageDetails =
        await clubSubscriptionPackagesModel.getClubSubscriptionPackageDetails(
          filter
        );
      res.status(200).json(clubSubscriptionPackageDetails);
    } catch (error) {
      next(error);
    }
  }
);
clubSubscriptionPackagesRouter.get(
  "/:club_subscription_package_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubSubscriptionPackage =
        await clubSubscriptionPackagesModel.getById(
          req.params.club_subscription_package_id
        );
      res.status(200).json(clubSubscriptionPackage);
    } catch (error) {
      next(error);
    }
  }
);

clubSubscriptionPackagesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newClubSubscriptionPackage =
        await clubSubscriptionPackagesModel.add(req.body);
      res.status(201).json(newClubSubscriptionPackage);
    } catch (error) {
      next(error);
    }
  }
);

clubSubscriptionPackagesRouter.put(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clubSubscriptionPackagesModel.update(req.body);
      const updatedClubSubscriptionPackage =
        await clubSubscriptionPackagesModel.getById(
          req.body.club_subscription_package_id
        );
      res.status(200).json(updatedClubSubscriptionPackage);
    } catch (error) {
      next(error);
    }
  }
);
export default clubSubscriptionPackagesRouter;
