import z from "zod";
import type { Request, Response } from "express";
import {
  addCategoryValidator,
  CategoryIdValidator,
  editCategoryValidator,
} from "../validators/category.validator";
import CategoryModel from "../models/Category.model";
import { BaseError } from "../utils/BaseError";
import cloudinary, { upload } from "../config/cloudinary";

export const addCategory = async (
  req: Request<object, object, z.infer<typeof addCategoryValidator>, object>,
  res: Response,
) => {
  const { title, description } = req.body;
  const img = req.file;
  if (!img) {
    throw new BaseError("please, upload an image", 400);
  }
  const category = await CategoryModel.findOne({ title });
  if (category) {
    throw new BaseError("Category Already exists", 400);
  }

  const newCategory = await CategoryModel.create({
    title,
    description,
    img: {
      url: img.path,
      public_id: img.filename,
    },
  });

  return res
    .status(201)
    .send({ msg: "Category Successfully Added", newCategory });
};

export const deleteCategory = async (
  req: Request<z.infer<typeof CategoryIdValidator>, object, object, object>,
  res: Response,
) => {
  const { id } = req.params;

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new BaseError("category not found", 404);
  }

  return res.status(200).json({ message: "Category deleted successfully" });
};

export const editCategory = async (
  req: Request<
    z.infer<typeof CategoryIdValidator>,
    object,
    z.infer<typeof editCategoryValidator>,
    object
  >,
  res: Response,
) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new BaseError("Category not found", 404);
  }
  if (req.file) {
    if (category.img && category.img.public_id) {
      await cloudinary.uploader.destroy(category.img.public_id);
    }
    category.img = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  Object.assign(category, req.body);
  await category.save();

  return res
    .status(200)
    .json({ message: "category updated successfully", data: category });
};

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryModel.find({});
  return res.status(200).json({ data: categories });
};

export const getSingleCategory = async (
  req: Request<z.infer<typeof CategoryIdValidator>, object, object, object>,
  res: Response,
) => {
  const {id} = req.params;
  
  const category = await CategoryModel.findById(id);

  if(!category) {
    throw new BaseError("category not found" , 404);
  }
  return res.status(200).json({data : category});
};
