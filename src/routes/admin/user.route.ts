import { Router } from "express";
const userRouter = Router();

import { allowedTo } from "../../middlewares/handlePermissions";
import { AsyncHandler } from "../../middlewares/AsyncHandler";
import {
  getAllUsers,
  addUser,
  deleteUser,
  updateUserDataByAdmin,
  getSingleUser,
} from "../../services/user.services";

import { upload } from "../../config/cloudinary";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import {
  userValidator,
  userParamsValidator,
  updateUserDataByAdminValidator,
} from "../../validators/user.validator";
import { authProtect } from "../../middlewares/authMiddleware";

userRouter.use(authProtect);
userRouter.use(allowedTo("admin"));
// GET ALL USERS BY ADMIN

userRouter.get("/", AsyncHandler(getAllUsers));

// ADD USER BY ADMIN
userRouter.post(
  "/",
  upload.single("profileImg"),
  handleValidationErrors({ body: userValidator }),
  AsyncHandler(addUser),
);

// DELETE USER BY ADMIN

userRouter.delete(
  "/:id",
  handleValidationErrors({ params: userParamsValidator }),
  AsyncHandler(deleteUser),
);

// UPDATE USER DATA BY ADMIN
userRouter.patch(
  "/:id",
  upload.single("profileImg"),
  handleValidationErrors({
    params: userParamsValidator,
    body: updateUserDataByAdminValidator,
  }),
  AsyncHandler(updateUserDataByAdmin),
);

// GET SINGLE USER
userRouter.get(
  "/:id",
  handleValidationErrors({ params: userParamsValidator }),
  AsyncHandler(getSingleUser),
);
export default userRouter;
