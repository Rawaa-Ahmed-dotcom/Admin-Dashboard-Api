import type { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import { BaseError } from "../utils/BaseError";
export const allowedTo = (...roles : string[]) => {
  return async(
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.userId;
  
    const user = await UserModel.findById(userId);
    if (user) {
      if (roles.includes(user.role)) {
        next();
      }
      else {
        throw new BaseError("Unauthorized : Permission denied", 403);
      }
    }
    
  };
}
