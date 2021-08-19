import mongoose from "mongoose";
const { Schema } = mongoose;
const TransferRequirementSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    require: [true, "user is required"],
    ref: "User",
  },
  type: {
    type: String,
    enum: ["withdraw", "deposit"],
    require: [true, "type is required"],
  },
  status: {
    type: String,
    enum: ["waiting", "confirming", "confirmed"],
    require: "status is required",
  },
  amount: {
    type: Number,
    require: [true, "amount is required"],
  },
});
const TransferRequirement = mongoose.model(
  "TransferRequirement",
  TransferRequirementSchema
);
export default TransferRequirement;
