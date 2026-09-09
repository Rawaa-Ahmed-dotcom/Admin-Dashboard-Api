import { Router } from "express";
import { authProtect } from "../../middlewares/authMiddleware";
import { allowedTo } from "../../middlewares/handlePermissions";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import {
  addCategoryValidator,
  CategoryIdValidator,
  editCategoryValidator,
} from "../../validators/category.validator";
import { AsyncHandler } from "../../middlewares/AsyncHandler";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "../../services/category.services";
import { upload } from "../../config/cloudinary";

const categoryRouter = Router();

categoryRouter.use(authProtect);
categoryRouter.use(allowedTo("admin"));

// ADD NEW CATEGORY

categoryRouter.post(
  "/",
  upload.single("img"),
  handleValidationErrors({ body: addCategoryValidator }),
  AsyncHandler(addCategory),
);

categoryRouter.delete(
  "/:id",
  handleValidationErrors({ params: CategoryIdValidator }),
  AsyncHandler(deleteCategory),
);

categoryRouter.patch(
  "/:id",
  upload.single("img"),
  handleValidationErrors({
    params: CategoryIdValidator,
    body: editCategoryValidator,
  }),
  AsyncHandler(editCategory),
);
export default categoryRouter;
