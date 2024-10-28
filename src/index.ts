import "dotenv/config";
import express from "express";
import { API_VERSION, PORT } from "./config/env";
import { mainRouter } from "./routes";

const server = express();

server.use(express.json({ limit: "5mb" }));

server.use(`/api/v${API_VERSION}`, mainRouter);

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
