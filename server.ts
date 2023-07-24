import express, { Request, Response } from "express";

import usersAuthRouter from "./src/api/users-auth/auth-router";
import usersRouter from "./src/api/users/users-router";
import playersRouter from "./src/api/players/players-router";

import locationsRouter from "./src/api/locations/locations-router";
import playerLevelsRouter from "./src/api/player-levels/player-levels-router";
import userTypesRouter from "./src/api/user-types/user-types-router";
import userStatusTypesRouter from "./src/api/user-status-types/user-status-types-router";
import clubsRouter from "./src/api/clubs/clubs-router";
import clubTypesRouter from "./src/api/club-types/club-types-router";
import trainersRouter from "./src/api/trainers/trainers-router";
import trainerEmploymentTypesRouter from "./src/api/trainer-employment-types/trainer-employment-types-router";
import trainerExperienceTypesRouter from "./src/api/trainer-experience-types/trainer-experience-types-router";

const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/usersAuth", usersAuthRouter);
server.use("/api/users", usersRouter);
server.use("/api/players", playersRouter);
server.use("/api/locations", locationsRouter);
server.use("/api/player-levels", playerLevelsRouter);
server.use("/api/user-types", userTypesRouter);
server.use("/api/user-status-types", userStatusTypesRouter);
server.use("/api/clubs", clubsRouter);
server.use("/api/club-types", clubTypesRouter);
server.use("/api/trainers", trainersRouter);
server.use("/api/trainer-employment-types", trainerEmploymentTypesRouter);
server.use("/api/trainer-experience-types", trainerExperienceTypesRouter);

server.get("/", (_req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

export default server;
