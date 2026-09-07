import { Router } from "express";
import adminRouter from "./admin/index";
import userRouter from "./user/index";
const globalRouter = Router();

globalRouter.use("/api/admin", adminRouter);
globalRouter.use("/api", userRouter);


export default globalRouter;