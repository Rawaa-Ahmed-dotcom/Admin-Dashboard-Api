import {Router} from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import categoryRouter from "./categories.route";

const router = Router();

router.use("/auth" , authRouter);
router.use("/users", userRouter);
router.use("/categories" , categoryRouter);

export default router;