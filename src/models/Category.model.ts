import mongoose from "mongoose";
import slugify from "slugify";
const categoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category Title is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      max: 200,
    },
    slug: {
      type: String,
    },
    img: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true },
);

categoriesSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      replacement: "-",
      strict: true,
      lower: true,
      trim: true,
    });
  }
});
export default mongoose.model("Category", categoriesSchema);
