import { Router } from "express";
import { createOrder, listOrders } from "../controllers/report";
import { validateOrder } from "../middleware/user";

const orderRouter = Router();

orderRouter.get("/", listOrders);
orderRouter.post("/", validateOrder, createOrder);

export { orderRouter };
