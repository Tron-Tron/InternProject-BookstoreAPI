import mongoose from "mongoose";
import geocoder from "./../utils/geocoder.js";
const { Schema } = mongoose;
const CustomerSchema = new Schema(
  {
    customer_name: {
      type: String,
      required: [true, "customer_name is required"],
      default: " ",
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    avatar: {
      type: String,
      required: [true, "avatar is required"],
      default: "avatar.jpg",
    },
    address: {
      province: {
        type: String,
        required: [true, "province is required"],
        default: "Hồ Chí Minh",
      },
      district: {
        type: String,
        required: [true, "district is required"],
        default: "TP. Thủ Đức",
      },
      ward: {
        type: String,
        required: [true, "ward is required"],
        default: "Phường Linh Chiểu",
      },
      text: {
        type: String,
        required: [true, "text is required"],
        default: "11 Đường số 4",
      },
    },
    location: {
      type: { type: String },
      coordinates: {
        type: [],
      },
    },
    status: {
      type: String,
      required: [true, "status is required"],
      enum: ["active", "disable"],
      default: "active",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
CustomerSchema.virtual("normalizedAddress").get(function () {
  return `${this.address.text}, ${this.address.ward}, ${this.address.district}, ${this.address.province}`;
});

CustomerSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.normalizedAddress);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
  next();
});
const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
