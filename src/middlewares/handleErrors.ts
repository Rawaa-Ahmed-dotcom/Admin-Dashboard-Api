import { NextFunction, Request, Response } from "express";
import { BaseError } from "../utils/BaseError";
export const handleErrors = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  return process.env.MODE === "development"
    ? handleDevErrors(err, res)
    : handleProdErrors(err, res);
};

const handleDevErrors = (err: BaseError, res: Response) => {
  return res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
    status: err.status,
  });
};
const handleProdErrors = (err: BaseError, res: Response) => {
  return res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
  });
};
