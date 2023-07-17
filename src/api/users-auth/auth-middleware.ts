import { Request, Response, NextFunction } from "express";
import usersModel from "../users/users-model";

export const credentialsExist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, user_type_id, user_status_type_id } = req.body;
  if (!email || !user_status_type_id || !password || !user_type_id) {
    res.status(400).json({ message: "Required fields are missing" });
  } else {
    next();
  }
};

export const emailUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const emailExist = await usersModel.getByFilter({ email });
  if (emailExist) {
    res.status(400).json({ message: "Email is already registered" });
  } else {
    next();
  }
};

export const emailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const emailExists = await usersModel.getByFilter({ email });
  if (!emailExists) {
    res.status(400).json({ message: "Invalid credentials" });
  } else {
    next();
  }
};

export const loginCredentialsExist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Invalid credentials" });
  } else {
    next();
  }
};
