import  {  ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { fromError } from "zod-validation-error";
import { BaseError } from "../utils/BaseError";
interface Schemas {
  body?: ZodType<any, any, any>;
  params?: ZodType<any, any, any>;
  query?: ZodType<any, any, any>;
}

export const handleValidationErrors = (schemas: Schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      console.log(req.body);
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        const validationMessage = fromError(result.error);
        throw new BaseError(validationMessage.toString().replace(/(\"|\n)/g, ""), 400);
      }
      req.body = result.data;
    }
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        const validationMessage = fromError(result.error);
        throw new BaseError(validationMessage.toString().replace(/(\"|\n)/g, ""), 400);
      }
      req.params = result.data ;
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        const validationMessage = fromError(result.error);
        throw new BaseError(validationMessage.toString().replace(/(\"|\n)/g, ""), 400);
      }
      req.query = result.data;
    }
    next();
  };
};
