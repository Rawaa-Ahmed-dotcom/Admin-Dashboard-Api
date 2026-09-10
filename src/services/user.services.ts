import type { NextFunction, Request, Response } from "express";
import z from "zod";
import {
  editUserDataValidator,
  userParamsValidator,
  userValidator,
  updateUserDataByAdminValidator,
  changePasswordValidator,
} from "../validators/user.validator";
import UserModel from "../models/User.model";
import { BaseError } from "../utils/BaseError";
import bcrypt from "bcrypt";

// ========= ADMIN SERVICES ==============
export const addUser = async (
  req: Request<object, object, z.infer<typeof userValidator>, object>,
  res: Response,
) => {
  const { email } = req.body;
  const profileImg = req.file;
  const user = await UserModel.findOne({ email });

  if (user) {
    throw new BaseError("user already exists", 409);
  }

  if (!profileImg) {
    throw new BaseError("Please, upload a profile image", 400);
  }

  const newUser = await UserModel.create({
    ...req.body,
    profileImg: { url: profileImg.path, public_id: profileImg.filename },
  });

  await newUser.save();

  const userObj = newUser.toObject();
  const { password, ...data } = userObj;
  return res.status(201).json({ message: "User added successfully", data });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find({}).select("-password");

  return res.status(200).json({ data: users });
};

export const deleteUser = async (
  req: Request<z.infer<typeof userParamsValidator>, object, object, object>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    throw new BaseError("user already not existed", 404);
  }
  return res.status(200).json({ message: "user deleted successfully" });
};

export const updateUserDataByAdmin = async (
  req: Request<
    z.infer<typeof userParamsValidator>,
    object,
    z.infer<typeof updateUserDataByAdminValidator>,
    object
  >,
  res: Response,
) => {
  const { id } = req.params;
  const profileImg = req.file;

  const updateData = {
    ...req.body,
    ...(profileImg && {
      profileImg: {
        url: profileImg.path,
        public_id: profileImg.filename,
      },
    }),
  };

  const user = await UserModel.findByIdAndUpdate(
    id,
    updateData,
    {
      runValidators: true,
      returnDocument: "after",
    },
  ).select("-password");

  if (!user) {
    throw new BaseError("user not found", 404);
  }

  return res
    .status(200)
    .json({ message: "user updated successfully", data: user });
};


export const getSingleUser = async (
  req: Request<z.infer<typeof userParamsValidator>, object, object, object>,
  res: Response,
) => {
  const { id } = req.params;

  const user = await UserModel.findById(id).select("-password");

  if (!user) {
    throw new BaseError("user not found", 404);
  }
  return res.status(200).json({ data: user });
};



// ========= USER SERVICES ==============
export const editUser = async (
  req: Request<
    z.infer<typeof userParamsValidator>,
    object,
    z.infer<typeof editUserDataValidator>,
    object
  >,
  res: Response,
) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new BaseError("user not found", 400);
  }
  Object.assign(user, req.body);
  await user.save();

  return res
    .status(200)
    .json({ message: "User updated successfully", data: user });
};

export const changePassword = async (
  req: Request<object, object, z.infer<typeof changePasswordValidator>, object>,
  res: Response,
) => {
  const { newPassword, currentPassword } = req.body;
  const userId = req.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new BaseError("user not found", 404);
  }

  const compared = await bcrypt.compare(currentPassword, user.password);

  if (!compared) {
    throw new BaseError("current password is wrong", 400);
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date(Date.now());
  await user.save();

  return res.status(200).json({ message: "password changed successfully" });
};

export const changeProfileImg = async (req : Request, res : Response) => {
  const profileImg = req.file;
  const userId = req.userId;
  if(!profileImg) {
    throw new BaseError("Please, upload a profile image", 400);
  }
  
  const user = await UserModel.findById(userId);

  if(!user) {
    throw new BaseError("user not found", 404);
  }

  user.profileImg = {
    url : profileImg.path,
    public_id : profileImg.filename
  };

  await user.save();
  return res.status(200).json({message : "Profile image updated successfully", data : user.profileImg});
};
