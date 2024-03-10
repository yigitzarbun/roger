import { Request, Response, NextFunction, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import usersModel from "../users/users-model";

import { JWT_SECRET } from "../../../config/secrets";
import {
  credentialsExist,
  emailUnique,
  emailExists,
  loginCredentialsExist,
} from "./auth-middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  credentialsExist,
  emailUnique,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = req.body;
      const hash = bcrypt.hashSync(credentials.password, 8);
      credentials.password = hash;
      const newUser = await usersModel.add(credentials);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/login",
  loginCredentialsExist,
  emailExists,
  (req: Request, res: Response, next: NextFunction) => {
    const { email, password, language } = req.body;
    usersModel
      .getByFilter({ email })
      .then((user) => {
        if (
          user &&
          bcrypt.compareSync(password, user.user.password) &&
          user.user.user_status_type_id === 1
        ) {
          const token = generateToken(user);
          res.status(200).json({ user, token, language });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(next);
  }
);

function generateToken(user: any) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

export default authRouter;
