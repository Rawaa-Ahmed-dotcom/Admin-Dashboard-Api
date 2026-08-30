import mongoose from "mongoose";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { boolean } from "zod/v4/core/regexes.cjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true , "Please enter your username"],
    unique: [true , "That username is already taken."],
    validate : {
      validator : function(val : string)  {
        return /^[a-zA-Z ]+$/.test(val);
      },
      message : "Please use only letters and spaces for your username."
    }
  },
  slug: {
    type: String,
    unique: true,
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
  },
  password: {
    type: String,
    required: [true , "password is required"]
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
        return /^(\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
          val,
        );
      },
      message:
        "Oops! That doesn't look quite right. Please enter a valid 10-digit phone number so we can stay in touch!",
    },
  },
  passwordResetCode:  String,
  passwordResetCodeVerified: Boolean,
  passwordResetCodeExpireDate : Date
});

userSchema.pre("save", async function () {
  if (this.isModified("username")) {
    this.slug = slugify(this.username, {
      lower: true,
      trim: true,
      remove : undefined,
      replacement : "-"
    });
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

export default mongoose.model("User", userSchema);
