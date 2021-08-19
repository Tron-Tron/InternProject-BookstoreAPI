import mongoose from "mongoose";
const { Schema } = mongoose;
import { userService } from "./../users/userService.js";
import User from "./../users/userModel.js";

const OrderSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "picking",
        "picked",
        "delivering",
        "delivered",
        "completed",
        "canceled",
      ],
      require: [true, "status is required"],
      default: "picking",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: [true, "user is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      require: [true, "store is required"],
    },
    productOrder: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        amountCart: {
          type: Number,
          require: [true, "amount is required"],
          default: 0,
        },
      },
    ],
    totalOrder: {
      type: Number,
      require: [true, "totalOrder is required"],
      default: 0,
    },
    note: {
      type: String,
      require: [true, "note is required"],
      default: "No comment",
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
