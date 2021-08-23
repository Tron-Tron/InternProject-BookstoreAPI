import ErrorResponse from "../utils/errorResponse.js";
import { storeService } from "./../store/storeService.js";
import mongoose from "mongoose";
const checkActiveStore = async (req, res, next) => {
  const storeUser = req.user.storeId;

  try {
    const isExistStore = await storeService
      .findOne({
        _id: mongoose.Types.ObjectId(storeUser),
        status: "active",
      })
      .catch((e) => {
        console.log(e);
      });

    if (!isExistStore) {
      return next(new ErrorResponse(404, "Your store is currently inactive"));
    }

    next();
  } catch (error) {
    throw new ErrorResponse(401, "error");
  }
};
export default checkActiveStore;
