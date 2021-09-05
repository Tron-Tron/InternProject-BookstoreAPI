import mongoose from "mongoose";
import geocoder from "./../utils/geocoder.js";
const { Schema } = mongoose;
const StoreSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
    name: {
      type: String,
      required: [true, "name store is required"],
      unique: true,
    },
    address: {
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
        index: "2dsphere",
      },
    },
    status: {
      type: String,
      required: [true, "status is required"],
      enum: ["active", "disabled", "pending"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
StoreSchema.virtual("normalizedAddress").get(function () {
  return `${this.address.text}, ${this.address.ward}, ${this.address.district}, ${this.address.province}`;
});

StoreSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.normalizedAddress);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
  };
  next();
});
const Store = mongoose.model("Store", StoreSchema);
export default Store;
