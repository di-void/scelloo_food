// routes
import { Router } from "express";
import { userRouter } from "./users";
import { orderRouter } from "./orders";
import { reportsRouter } from "./reports";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/orders", orderRouter);
mainRouter.use("/reports", reportsRouter);

mainRouter.get("/test", (_req, res) => {
  res.status(200).json({ message: "success", data: "hello world" });
});

export { mainRouter };
