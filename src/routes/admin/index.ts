import { Router } from "express";
import userRouter from "./user.route";

const adminRouter = Router();

adminRouter.use("/users", userRouter);

export default adminRouter;