import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  listOrders,
  updateOrderStatus,
} from "../controllers/order";
import { validateOrder } from "../middleware/user";

const orderRouter = Router();

orderRouter.get("/", listOrders);
orderRouter.post("/", validateOrder, createOrder);
orderRouter.patch("/:orderId", updateOrderStatus);
orderRouter.delete("/:orderId", deleteOrder);

export { orderRouter };
