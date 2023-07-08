require("dotenv").config({
  path: ".env.local",
});

import server from "./src/api/server";

const port: number = parseInt(process.env.PORT || "3000", 10);

server.listen(port, () => {
  console.log(`TypeScript with Express
		http://localhost:${port}/`);
});
