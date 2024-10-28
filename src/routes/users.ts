import { Router } from "express";
import { listUsers } from "../controllers/user";

const userRouter = Router();

userRouter.get("/", listUsers);

export { userRouter };
