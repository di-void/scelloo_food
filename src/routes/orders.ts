import { Router } from "express";

const orderRouter = Router();

orderRouter.get("/", (_req, res) => {
  res.json("Orders");
});

export { orderRouter };
