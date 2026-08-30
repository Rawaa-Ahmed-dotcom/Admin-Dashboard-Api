import z, { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { fromError } from "zod-validation-error";
import { BaseError } from "../utils/BaseError";
interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const handleValidationErrors = (schemas: Schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if(!result.success) {
            const validationMessage = fromError(result.error);
            throw new BaseError(validationMessage.toString() , 400);
        }
        Object.assign(req.body , result.data);
    }
    if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if(!result.success) {
            const validationMessage = fromError(result.error);
            throw new BaseError(validationMessage.toString() , 400);
        }
        Object.assign(req.params , result.data);
    }
    if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if(!result.success) {
            const validationMessage = fromError(result.error);
            throw new BaseError(validationMessage.toString() , 400);
        }
        Object.assign(req.query , result.data);
    }
    next();
  };
};
