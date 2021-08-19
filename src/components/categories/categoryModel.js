import mongoose from "mongoose";
const { Schema } = mongoose;
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    status: {
      type: String,
      required: [true, "status is required"],
      enum: ["active", "disable"],
      default: "active",
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "Store is required"],
    },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", CategorySchema);
export default Category;
