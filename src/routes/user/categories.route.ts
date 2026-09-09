import { Router } from "express";
import { AsyncHandler } from "../../middlewares/AsyncHandler";
import {
  getAllCategories,
  getSingleCategory,
} from "../../services/category.services";
import { handleValidationErrors } from "../../middlewares/handleValidationErrors";
import { CategoryIdValidator } from "../../validators/category.validator";

const categoryRouter = Router();

// GET ALL CATEGORIES
categoryRouter.get("/", AsyncHandler(getAllCategories));

// GET SINGLE CATEGORY

categoryRouter.get(
  "/:id",
  handleValidationErrors({ params: CategoryIdValidator }),
  AsyncHandler(getSingleCategory),
);
export default categoryRouter;
