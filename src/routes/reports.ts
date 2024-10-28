import { Router } from "express";

const reportsRouter = Router();

reportsRouter.get("/", (_req, res) => {
  res.json("Reports");
});

export { reportsRouter };
