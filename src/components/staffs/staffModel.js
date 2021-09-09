import mongoose from "mongoose";
import geocoder from "./../utils/geocoder.js";
const { Schema } = mongoose;
const StaffSchema = new Schema(
  {
    staff_name: {
      type: String,
      required: [true, "staff_name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    address: {
      province: {
        type: String,
        required: [true, "province is required"],
        //     default: " ",
      },
      district: {
        type: String,
        required: [true, "district is required"],
        //       default: " ",
      },
      ward: {
        type: String,
        required: [true, "ward is required"],
        //  default: " ",
      },
      text: {
        type: String,
        required: [true, "text is required"],
        //     default: " ",
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
    store: {
      type: String,
      ref: "Store",
      required: [true, "Store is required"],
      default: " ",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
StaffSchema.virtual("normalizedAddress").get(function () {
  return `${this.address.text}, ${this.address.ward}, ${this.address.district}, ${this.address.province}`;
});
StaffSchema.virtual("account_detail", {
  ref: "User",
  localField: "email",
  foreignField: "email",
  justOne: true,
});
StaffSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.normalizedAddress);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
  next();
});
const Staff = mongoose.model("Staff", StaffSchema);
export default Staff;
