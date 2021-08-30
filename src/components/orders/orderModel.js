import mongoose from "mongoose";
const { Schema } = mongoose;

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
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      require: [true, "customer is required"],
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
    ship: {
      type: Number,
      required: [true, "ship is required"],
      default: 0,
    },
    voucher: {
      type: Number,
      required: [true, "voucher is required"],
      default: 0,
    },
    totalOrder: {
      type: Number,
      require: [true, "totalOrder is required"],
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "wallet"],
      default: "wallet",
    },
    deliveryAddress: {
      province: {
        type: String,
        required: [true, "province is required"],
        default: " ",
      },
      district: {
        type: String,
        required: [true, "district is required"],
        default: " ",
      },
      ward: {
        type: String,
        required: [true, "ward is required"],
        default: " ",
      },
      text: {
        type: String,
        required: [true, "text is required"],
        default: " ",
      },
    },
    location: {
      type: { type: String },
      coordinates: {
        type: [],
      },
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
OrderSchema.virtual("normalizedAddress").get(function () {
  return `${this.deliveryAddress.text}, ${this.deliveryAddress.ward}, ${this.deliveryAddress.district}, ${this.deliveryAddress.province}`;
});

OrderSchema.pre("save", async function (next) {
  if (
    this.deliveryAddress.province === " " &&
    this.deliveryAddress.district === " " &&
    this.deliveryAddress.ward === " " &&
    this.deliveryAddress.text === " "
  ) {
    this.location = {};
    next();
  } else {
    const loc = await geocoder.geocode(this.normalizedAddress);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
    };
    next();
  }
});
const Order = mongoose.model("Order", OrderSchema);
export default Order;
