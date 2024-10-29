// routes
import { Router } from "express";
import { userRouter } from "./users";
import { orderRouter } from "./orders";
import { reportsRouter } from "./reports";
import { foodsRouter } from "./foods";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/orders", orderRouter);
mainRouter.use("/reports", reportsRouter);
mainRouter.use("/foods", foodsRouter);

export { mainRouter };
