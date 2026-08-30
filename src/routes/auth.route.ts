import e, { Router } from "express";
import { handleValidationErrors } from "../middlewares/handleValidationErrors";
import {
  authValidator,
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  verifyResetCodeValidator,
} from "../validators/auth.validator";
import { AsyncHandler } from "../middlewares/AsyncHandler";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyResetCode,
} from "../services/auth.services";

const authRouter = Router();

authRouter.post(
  "/signup",
  handleValidationErrors({ body: authValidator }),
  AsyncHandler(signup),
);

authRouter.post(
  "/login",
  handleValidationErrors({ body: loginValidator }),
  AsyncHandler(login),
);

authRouter.all("/logout", AsyncHandler(logout));

authRouter.post(
  "/forgot-password",
  handleValidationErrors({ body: forgotPasswordValidator }),
  AsyncHandler(forgotPassword),
);

authRouter.post(
  "/verify-reset-code",
  handleValidationErrors({ body: verifyResetCodeValidator }),
  AsyncHandler(verifyResetCode)
);

authRouter.patch(
  "/reset-password",
  handleValidationErrors({ body: resetPasswordValidator }),
  AsyncHandler(resetPassword)
)
export default authRouter;
