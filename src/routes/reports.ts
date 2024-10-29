import { Router } from "express";
import { generateOrderReport } from "../controllers/report";

const reportsRouter = Router();

reportsRouter.get("/end-of-day", generateOrderReport);

export { reportsRouter };
