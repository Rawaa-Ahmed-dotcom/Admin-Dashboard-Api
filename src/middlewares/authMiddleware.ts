import type { NextFunction, Response, Request } from "express";
import { BaseError } from "../utils/BaseError";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";

interface jwtPayload {
  userId: string;
  iat: number;
}


export const authProtect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    throw new BaseError("UnAuthenticated : Missing or malformed token", 401);
  }
  const token = authHeader.split(" ")[1];

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new BaseError("Server configration error: missing secret key", 500);
  }
  const decoded = jwt.verify(token, secretKey) as jwtPayload;
  if (!decoded || !decoded.userId) {
    throw new BaseError("Invalid token payload", 401);
  }

  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new BaseError("User that belongs to this token is not found", 401);
  }

  user.handleChangePassword(decoded.iat);

  req.userId = decoded.userId;
  next();
};
