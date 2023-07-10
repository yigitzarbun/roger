import { Request, Response, NextFunction, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import playersModel from "../players/players-model";

import { JWT_SECRET } from "../../../config/secrets";
import {
  credentialsExist,
  emailUnique,
  emailExists,
  loginCredentialsExist,
} from "../players_auth/auth-middleware";

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
      const newPlayer = await playersModel.add(credentials);
      res.status(201).json(newPlayer);
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
    const { email, password } = req.body;
    playersModel
      .getByFilter({ email })
      .then((player) => {
        if (player && bcrypt.compareSync(password, player.password)) {
          const token = generateToken(player);
          res.status(200).json({ player, token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(next);
  }
);

function generateToken(player: any) {
  const payload = {
    player_id: player.player_id,
    email: player.email,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

export default authRouter;
