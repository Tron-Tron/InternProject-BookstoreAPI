import mongoose from "mongoose";
const { Schema } = mongoose;

const StaffRequirementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "userId is required"],
      ref: "User",
    },
    storeId: {
      type: Schema.Types.ObjectId,
      required: [true, "storeId is required"],
      ref: "Store",
    },
    roleRegister: {
      type: String,
      enum: ["manager", "officer", "cashier", "shipper"],
      required: [true, "roleRegister is required"],
    },
    roleAccept: {
      type: String,
      required: [true, "roleAccept is required"],
      enum: ["admin", "manager"],
    },
  },
  {
    timestamps: true,
  }
);
const StaffRequirement = mongoose.model(
  "StaffRequirement",
  StaffRequirementSchema
);
export default StaffRequirement;
