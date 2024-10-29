import { Router } from "express";
import { listFoods } from "../controllers/foods";

const foodsRouter = Router();

foodsRouter.get("/", listFoods);

export { foodsRouter };
