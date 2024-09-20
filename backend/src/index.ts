import dotenv from "dotenv";
import http from "http";
import server from "./server";

dotenv.config({ path: ".env.local" });

const port: number = parseInt(process.env.PORT || "3000", 10);
const httpServer = http.createServer(server);

// Create Socket.io instance
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*", // You should configure this to allow connections only from trusted domains
  },
});

// Handle Socket.io connections
io.on("connection", (socket: any) => {
  console.log("A user connected");

  // Handle custom events or emit data to the connected clients as needed

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`TypeScript with Express\nhttp://0.0.0.0:${port}/`);
});
