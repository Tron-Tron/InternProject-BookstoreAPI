import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    image: {
      type: Array,
      required: [true, "image is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    status: {
      type: String,
      enum: ["active", "disable", "out-of-stock"],
      required: [true, "status is required"],
      default: "active",
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "store is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
ProductSchema.virtual("category_detail", {
  ref: "Category",
  localField: "category",
  foreignField: "_id",
  justOne: true,
});

export const Product = mongoose.model("Product", ProductSchema);
