import { Request, Response, NextFunction } from "express";
import playersModel from "../players/players-model";

export const credentialsExist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    birth_year,
    email,
    fname,
    gender,
    level,
    lname,
    password,
    user_type,
  } = req.body;
  if (
    !birth_year ||
    !email ||
    !fname ||
    !gender ||
    !level ||
    !lname ||
    !password ||
    !user_type
  ) {
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
  const emailExist = await playersModel.getByFilter({ email });
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
  const emailExists = await playersModel.getByFilter({ email });
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
