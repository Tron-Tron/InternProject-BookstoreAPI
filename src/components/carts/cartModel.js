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
    paymentMethod: {
      type: String,
      enum: ["cod", "wallet"],
      default: "wallet",
    },
    deliveryAddress: {
      province: {
        type: String,
        required: [true, "province is required"],
      },
      district: {
        type: String,
        required: [true, "district is required"],
      },
      ward: {
        type: String,
        required: [true, "ward is required"],
      },
      text: {
        type: String,
        required: [true, "text is required"],
      },
    },
    location: {
      type: { type: String },
      coordinates: {
        type: [],
      },
    },
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
CartSchema.virtual("normalizedAddress").get(function () {
  return `${this.deliveryAddress.text}, ${this.deliveryAddress.ward}, ${this.deliveryAddress.district}, ${this.deliveryAddress.province}`;
});

CartSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.normalizedAddress);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
