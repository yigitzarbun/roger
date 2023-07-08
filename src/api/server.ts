import express from "express";

const server: express.Application = express();

server.get("/", (_req, _res) => {
  _res.send("TypeScript With Express");
});

export default server;
