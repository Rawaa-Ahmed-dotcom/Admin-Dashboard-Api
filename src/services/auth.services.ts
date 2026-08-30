import type { Request, Response } from "express";
import z, { ZodE164 } from "zod";
import {
  authValidator,
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
  verifyResetCodeValidator,
} from "../validators/auth.validator";
import UserModel from "../models/User.model";
import { BaseError } from "../utils/BaseError";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../utils/sendEmail";
import { mailMessage } from "../utils/emailMessage";

export const signup = async (
  req: Request<object, object, z.infer<typeof authValidator>, object>,
  res: Response,
) => {
  const { username, email, password } = req.body;

  // check if user already exists
  const user = await UserModel.findOne({ email });
  if (user) {
    throw new BaseError("User Already exists", 400);
  }

  //   create new user
  const newUser = await UserModel.create({ username, email, password });
  await newUser.save();

  // Generate Tokens
  const secretKey = process.env.SECRET_KEY;
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
  if (!secretKey || !refreshSecretKey) {
    throw new BaseError("Server configration error : missing secret keys", 500);
  }
  const accessToken = generateToken(
    { userId: newUser._id },
    secretKey,
    15 * 60,
  );
  const refreshToken = generateToken(
    { userId: newUser._id },
    refreshSecretKey,
    7 * 24 * 60 * 60,
  );

  res.cookie("refreshCookie", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = newUser.toObject();
  const { password: pass, ...result } = userObj;

  return res.status(201).json({
    message: "User registered successfully!",
    data: {
      ...result,
      token: accessToken,
    },
  });
};

export const login = async (
  req: Request<object, object, z.infer<typeof loginValidator>, object>,
  res: Response,
) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new BaseError("Email or password is wrong", 400);
  }

  // Check if password is correct

  const compared = await bcrypt.compare(password, user.password);
  if (!compared) {
    throw new BaseError("Email or password is wrong", 400);
  }

  //generate tokens
  const secretKey = process.env.SECRET_KEY;
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
  if (!secretKey || !refreshSecretKey) {
    throw new BaseError("Server configration error : missing secret keys", 500);
  }

  const accessToken = generateToken({ userId: user._id }, secretKey, 15 * 60);
  const refreshToken = generateToken(
    { userId: user._id },
    refreshSecretKey,
    7 * 24 * 60 * 60,
  );

  res.cookie("refreshCookie", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  const { password: pass, ...result } = userObj;

  return res.status(200).json({
    message: "User logined successfully",
    data: {
      ...result,
      token: accessToken,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshCookie = req.cookies;
  if (!refreshCookie) {
    throw new BaseError("Missing Refresh token cookie", 500);
  }
  res.clearCookie("refreshCookie");
  return res.status(200).json({ message: "Logout successfully" });
};

export const forgotPassword = async (
  req: Request<object, object, z.infer<typeof forgotPasswordValidator>, object>,
  res: Response,
) => {
  const { email } = req.body;
  // check if user exists
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new BaseError("user not found", 400);
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpireDate = new Date(Date.now() + 10 * 60 * 1000);
  user.passwordResetCodeVerified = false;

  await user.save();
  console.log(1);

  const mailOptions = {
    from: `Express app <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Code",
    message: mailMessage(user.username, resetCode),
  };
  try {
    console.log(2);
    await sendMail(mailOptions);
  } catch (err) {
    console.log(3);
    user.passwordResetCode = null;
    user.passwordResetCodeExpireDate = null;
    user.passwordResetCodeVerified = null;

    await user.save();

    throw new BaseError("Something went wrong when sending the email", 500);
  }
  console.log(3);
  return res.status(200).json({ message: "Reset Code is sent" });
};

export const verifyResetCode = async (
  req: Request<
    object,
    object,
    z.infer<typeof verifyResetCodeValidator>,
    object
  >,
  res: Response,
) => {
  const { resetCode } = req.body;
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpireDate: { $gt: Date.now() },
  });

  if (!user) {
    throw new BaseError(
      "Reset code is invalid or expired. please click send again...",
      400,
    );
  }

  user.passwordResetCodeVerified = true;

  await user.save();
  return res.status(200).json({ message: "Reset code successfully verified" });
};

export const resetPassword = async (
  req: Request<object, object, z.infer<typeof resetPasswordValidator>, object>,
  res: Response,
) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BaseError(
      "It seems like the user with this email is not found",
      400,
    );
  }
  user.password = password;
  user.passwordResetCode = null;
  user.passwordResetCodeVerified = null;
  user.passwordResetCodeExpireDate = null;

  await user.save();

  // Generate tokens
  const secretKey = process.env.SECRET_KEY;
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
  if (!secretKey || !refreshSecretKey) {
    throw new BaseError("Server configration error : missing secret keys", 500);
  }

  const accessToken = generateToken({ userId: user._id }, secretKey, 15 * 60);
  const refreshToken = generateToken(
    { userId: user._id },
    refreshSecretKey,
    7 * 24 * 60 * 60,
  );
  res.cookie("refreshCookie", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;
  return res.status(200).json({message : "Password Reset successfully" , data: userObj})
};
