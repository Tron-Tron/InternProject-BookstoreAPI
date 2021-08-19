import mongoose from "mongoose";
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: [true, "store is required"],
    },
    reportProduct: [
      {
        monthReport: {
          type: String,
        },
        report: [
          {
            productId: {
              type: String,
              require: [true, "_id is required"],
            },
            revenue: {
              type: Number,
              require: [true, "revenue is required"],
              default: 0,
            },
            total_order: {
              type: Number,
              require: [true, "total_order is required"],
            },
          },
        ],
      },
    ],
    // reportCategory: [
    //   {
    //     _id: {
    //       type: String,
    //       require: [true, "_id is required"],
    //     },
    //     revenue: {
    //       type: Number,
    //       require: [true, "revenue is required"],
    //       default: 0,
    //     },
    //     total_order: {
    //       type: Number,
    //       require: [true, "total_order is required"],
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);
const Report = mongoose.model("Report", ReportSchema);
export default Report;
