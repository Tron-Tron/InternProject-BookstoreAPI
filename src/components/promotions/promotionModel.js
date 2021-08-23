import mongoose from "mongoose";
const { Schema } = mongoose;
const PromotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    date_start: {
      type: Date,
      required: [true, "date_start is required"],
    },
    date_end: {
      type: Date,
      required: [true, "date_end is required"],
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "staff is required"],
    },
    promotion_code: {
      type: String,
      required: [true, "promotion_code is required"],
    },
    percent: {
      type: Number,
      required: [true, "percent is required"],
    },
  },
  {
    timestamps: true,
  }
);
const Promotion = mongoose.model("Promotion", PromotionSchema);
export default Promotion;
