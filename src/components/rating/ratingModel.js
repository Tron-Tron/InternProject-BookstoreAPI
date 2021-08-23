import mongoose from "mongoose";
const { Schema } = mongoose;
const RatingSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, "customerId is required"],
      ref: "Customer",
    },
    rate: {
      type: Number,
      required: [true, "rate is required"],
    },
  },
  {
    timestamps: true,
  }
);
const Rating = mongoose.model("Rating", RatingSchema);
export default Rating;
