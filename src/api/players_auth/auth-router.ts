import playersModel from "../players/players-model";

const authRouter = require("express").Router();
const { JWT_SECRET } = require("../../config/secrets");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../secrets");
const playersMd = require("../players_auth/auth-middleware");

authRouter.post(
  "/register",
  playersMd.credentialsExist,
  playersMd.emailUnique,
  async (req, res, next) => {
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
  playersMd.loginCredentialsExist,
  playersMd.emailExists,
  (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);
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

function generateToken(player) {
  const payload = {
    player_id: player.player_id,
    email: player.email,
  };
  const options = {
    expiresIn: "1d",
  };
  const token = jwt.sign(payload, secrets.JWT_SECRET, options);
  return token;
}
module.exports = authRouter;
