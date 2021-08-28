import mongoose from "mongoose";
import geocoder from "./../utils/geocoder.js";
const { Schema } = mongoose;
const CartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      require: [true, "customer is required"],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        amountCart: {
          type: Number,
          required: [true, "amount is required"],
          default: 0,
        },
      },
    ],
    total: {
      type: Number,
      require: [true, "total is required"],
      default: 0,
    },
    status: {
      type: Boolean,
      require: [true, "status is required"],
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
