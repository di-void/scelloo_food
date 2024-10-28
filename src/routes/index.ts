// routes
import { Router } from "express";

const mainRouter = Router();

mainRouter.get("/test", (_req, res) => {
  res.status(200).json({ message: "success", data: "hello world" });
});

export { mainRouter };
