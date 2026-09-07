import mongoose from "mongoose";
import { authValidator } from "./auth.validator";
import z from "zod";

export const userValidator = authValidator.extend({
  role: z.optional(z.enum(["user", "manager", "admin"])),
  phone: z
    .string()
    .regex(/^\+\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/, {
      message:
        "Please enter a valid phone number including your country code (e.g., +1-555-123-4567).",
    }),
});

export const editUserDataValidator = userValidator
  .omit({ password: true, email: true, role: true })
  .partial()
  .strict();

export const userParamsValidator = z.object({
  id: z.string().refine((val) => mongoose.isValidObjectId(val), {
    message: "Invalid ObjectId",
  }),
});

export const updateUserDataByAdminValidator = userValidator
  .pick({
    username: true,
    phone: true,
    role: true,
  })
  .partial()
  .strict();

export const changePasswordValidator = z.object({
  newPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Please choose a password with at least 8 characters, including a mix of letters (uppercase and lowercase), numbers, and symbols.",
      },
    ),
  confirmPassword: z.string(),
  currentPassword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Please choose a password with at least 8 characters, including a mix of letters (uppercase and lowercase), numbers, and symbols.",
      },
    ),
}).refine((data) => data.newPassword === data.confirmPassword , {message : "Password and its confirmation is not equal"});
