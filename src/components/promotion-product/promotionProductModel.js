import mongoose from "mongoose";
const { Schema } = mongoose;
const PromotionProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    date_start: {
      type: Date,
      required: [true, "date_start is required"],
      default: Date.now(),
    },
    date_end: {
      type: Date,
      required: [true, "date_end is required"],
    },
    promotion_code: {
      type: String,
      required: [true, "promotion_code is required"],
    },
    percent: {
      type: Number,
      required: [true, "percent is required"],
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "product is required"],
        index: true,
      },
    ],
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "store is required"],
    },
  },
  {
    timestamps: true,
  }
);
const PromotionProduct = mongoose.model(
  "PromotionProduct",
  PromotionProductSchema
);
export default PromotionProduct;
