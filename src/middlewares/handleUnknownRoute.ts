import type { Request, Response, NextFunction } from "express";
import { BaseError } from "../utils/BaseError";

export const handleUnknownRoutes =  (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  throw new BaseError(`Can't handle unknown route : ${req.originalUrl}` , 404);
};
