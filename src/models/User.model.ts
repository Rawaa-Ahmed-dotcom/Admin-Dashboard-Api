import mongoose from "mongoose";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { BaseError } from "../utils/BaseError";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your username"],
    validate: {
      validator: function (val: string) {
        return /^[A-Za-z\u0621-\u064A]+ [A-Za-z\u0621-\u064A]+$/.test(val);
      },
      message:
        "Username must consist of exactly two words separated by a space, with no numbers or special characters (English or Arabic letters are allowed).",
    },
    unique : [true , "this username is already taken"]
  },
  slug: {
    type: String,
    unique : true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator: function (val: string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
      },
      message: "Please enter a valid email address (e.g., name@example.com).",
    },
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user",
  },
  phone: {
    type: String,
    validate: {
      validator: function (val: string) {
        return /^\+\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/.test(
          val,
        );
      },
      message:
        "Please enter a valid phone number including your country code (e.g., +1-555-123-4567).",
    },
    unique: [true , "this phone number is already taken "],
  },
  profileImg: {
    url: String,
    public_id: String,
  },
  passwordResetCode: String,
  passwordResetCodeVerified: Boolean,
  passwordResetCodeExpireDate: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", async function () {
  if (this.isModified("username")) {
    this.slug = slugify(this.username, {
      lower: true,
      trim: true,
      remove: undefined,
      replacement: "-",
    });
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.method("handleChangePassword", function (iat) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimestamp = Number(
      this.passwordChangedAt.getTime() / 1000,
    );
    if (passwordChangedAtTimestamp > iat) {
      throw new BaseError(
        "User that belongs to this token has changed his password.please login again...",
        401,
      );
    }
  }
});

export default mongoose.model("User", userSchema);
