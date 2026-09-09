import { Router } from "express";
import userRouter from "./user.route";
import categoryRouter from "./category.route";

const adminRouter = Router();

adminRouter.use("/users", userRouter);
adminRouter.use("/categories" , categoryRouter);


export default adminRouter;