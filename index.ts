import dotenv from "dotenv";
import server from "./server";

dotenv.config({ path: ".env.local" });

const port: number = parseInt(process.env.PORT || "5000", 10);

server.listen(port, () => {
  console.log(`TypeScript with Express\nhttp://localhost:${port}/`);
});
