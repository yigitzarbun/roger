import express, { Request, Response } from "express";

import usersAuthRouter from "./src/api/users-auth/auth-router";
import usersRouter from "./src/api/users/users-router";
import playersRouter from "./src/api/players/players-router";

const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/usersAuth", usersAuthRouter);
server.use("/api/users", usersRouter);
server.use("/api/players", playersRouter);

server.get("/", (_req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

export default server;
