import dotenv from "dotenv";
import http from "http";
import server from "./server";

dotenv.config({ path: ".env.local" });

const port: number = parseInt(process.env.PORT || "5000", 10); // Change to 5000
const httpServer = http.createServer(server);

// Create Socket.io instance
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*", // Update this to trusted domains in production
  },
});

// Handle Socket.io connections
io.on("connection", (socket: any) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`TypeScript with Express\nhttp://0.0.0.0:${port}/`);
});
