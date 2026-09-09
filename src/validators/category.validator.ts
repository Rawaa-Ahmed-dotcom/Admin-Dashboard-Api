import { isValidObjectId } from "mongoose";
import z from "zod";

export const addCategoryValidator = z.object({
    title : z.string(),
    description : z.string().max(200)
});

export const CategoryIdValidator = z.object({
    id : z.string()
}).refine((val) => isValidObjectId(val) , {message : "Invalid object id"});

export const editCategoryValidator = addCategoryValidator.partial();