import express, { Request, Response } from "express";
import playersAuthRouter from "./src/api/players_auth/auth-router";
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/playersAuth", playersAuthRouter);

server.get("/", (_req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

export default server;
