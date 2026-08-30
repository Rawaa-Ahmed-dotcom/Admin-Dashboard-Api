import z from "zod";

// Auth Validator (sign up)
export const authValidator = z.object({
  username: z
    .string({ message: "Username must be string" })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Please use only letters and spaces for your username.",
    }),
  email: z.email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Please enter a valid email address (e.g., name@example.com).",
  }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Please choose a password with at least 8 characters, including a mix of letters (uppercase and lowercase), numbers, and symbols.",
      },
    ),
});

export const loginValidator = authValidator.omit({ username: true });

export const forgotPasswordValidator = authValidator.pick({ email: true });

export const verifyResetCodeValidator = z.object({
  resetCode: z.string().length(6),
});

export const resetPasswordValidator = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Please choose a password with at least 8 characters, including a mix of letters (uppercase and lowercase), numbers, and symbols.",
        },
      ),
    passwordConfirm: z.string(),
    email: z.email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Please enter a valid email address (e.g., name@example.com).",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password and its confirmation are not the same",
    path: ["passwordConfirm"],
  });
