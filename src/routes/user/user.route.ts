import { Router } from "express";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import {
  editUserDataValidator,
  userParamsValidator,
  userValidator,
  updateUserDataByAdminValidator,
  changePasswordValidator,
} from "../../validators/user.validator";
import { upload } from "../../config/cloudinary";
import { AsyncHandler } from "../../middlewares/AsyncHandler";
import {
  addUser,
  changePassword,
  changeProfileImg,
  deleteUser,
  editUser,
  getAllUsers,
  updateUserDataByAdmin,
} from "../../services/user.services";
import { authProtect } from "../../middlewares/authMiddleware";

import authRouter from "./auth.route";

const userRouter = Router();


userRouter.use(authProtect);

// ============= USER SERVICES ===============

// CHANGE USER PASSWORD
userRouter.patch(
  "/change-password",
  handleValidationErrors({ body: changePasswordValidator }),
  changePassword,
);


// CHANGE PROFILE PHOTO 
userRouter.patch(
  "/change-profile-img",
  upload.single("profileImg"),
  changeProfileImg
);


// UPDATE USER DATA BY USER
userRouter.patch("/",
  handleValidationErrors({
    body: editUserDataValidator
  }),
  AsyncHandler(editUser),
);



export default userRouter;
