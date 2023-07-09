require("dotenv").config({
  path: ".env.local",
});

import server from "./server";

const port: number = parseInt(process.env.PORT || "5432", 10);

server.listen(port, () => {
  console.log(`TypeScript with Express
		http://localhost:${port}/`);
});
