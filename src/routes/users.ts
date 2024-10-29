import { Router } from "express";
import { createUser, deleteUser, listUsers } from "../controllers/user";

const userRouter = Router();

userRouter.get("/", listUsers);
userRouter.post("/", createUser);
userRouter.delete("/:userId", deleteUser);

export { userRouter };
