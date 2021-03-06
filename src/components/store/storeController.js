import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import mailService from "../commons/mail.js";
import { userService } from "../users/userService.js";
import ErrorResponse from "../utils/errorResponse.js";
import SuccessResponse from "../utils/successResponse.js";
import { storeService } from "./storeService.js";
import dotenv from "dotenv";
import { staffService } from "../staffs/staffService.js";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
export const addStore = asyncMiddleware(async (req, res, next) => {
  const { name, province, district, ward, text } = req.body;
  const isExistStoreOwner = await storeService.findOne({
    owner: req.user._id,
    status: "active",
  });
  if (isExistStoreOwner) {
    throw new ErrorResponse(400, "Can not add store");
  }
  const savedStore = await storeService.create({
    owner: req.user._id,
    name,
    address: { province, district, ward, text },
  });
  await staffService.findOneAndUpdate(
    { _id: req.user._id, status: "active" },
    { store: savedStore._id },
    { new: true }
  );
  return new SuccessResponse(200, savedStore).send(res);
});
export const getAllStoreRequirements = asyncMiddleware(
  async (req, res, next) => {
    const { page, perPage } = req.query;
    const stores = await storeService.getAll(
      { status: "pending" },
      null,
      null,
      page,
      perPage
    );
    if (!stores.length) {
      throw new ErrorResponse(400, "No Stores");
    }
    return new SuccessResponse(200, stores).send(res);
  }
);
export const acceptStore = asyncMiddleware(async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId.trim()) {
    throw new ErrorResponse(400, "storeId is empty");
  }
  const storeAccept = await storeService.findOneAndUpdate(
    { _id: storeId, status: "pending" },
    { status: "active" },
    { new: true }
  );
  if (!storeAccept) {
    throw new ErrorResponse(404, "No store");
  }
  const owner = await userService.findOne({
    _id: storeAccept.owner,
    status: true,
  });
  if (!owner) {
    throw new ErrorResponse(404, "No user");
  }
  await staffService.findOneAndUpdate(
    { email: owner.email, status: "active" },
    { store: storeId },
    { new: true }
  );
  await mailService(
    process.env.EMAIL,
    owner.email,
    "TH??NG B??O T???O C???A H??NG TR??N K??NH TH????NG M???I ??I???N T??? TR??N TR??N",
    `<p>Xin ch??o ${storeAccept.name}, <br>
        Ch??ng t??i ???? nh???n ???????c th??ng tin v??? ????ng k?? c???a h??ng tr??n website c???a ch??ng t??i.<br>
        Sau qu?? tr??nh x??c nh???n, c???a h??ng c???a b???n ???? ???????c ph?? duy???t v?? ??i v??o ho???t ?????ng.
        Xin ch??n th??nh c???m ??n!
    </p>`
  );
  return new SuccessResponse(200, `Store ${storeAccept.name} is accepted`).send(
    res
  );
});
export const denyStore = asyncMiddleware(async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId.trim()) {
    throw new ErrorResponse(400, "storeId is empty");
  }
  const storeAccept = await storeService.findOneAndDelete({
    _id: storeId,
    status: "pending",
  });
  if (!storeAccept) {
    throw new ErrorResponse(404, "No store");
  }
  const owner = await userService.findOne({
    _id: storeAccept.owner,
    status: true,
  });
  if (!owner) {
    throw new ErrorResponse(404, "No user");
  }
  await mailService(
    process.env.EMAIL,
    owner.email,
    "TH??NG B??O T???O C???A H??NG TR??N K??NH TH????NG M???I ??I???N T??? TR??N TR??N",
    `<p>Xin ch??o ${storeAccept.name}, <br>
        Ch??ng t??i ???? nh???n ???????c th??ng tin v??? ????ng k?? c???a h??ng tr??n website c???a ch??ng t??i.<br>
        Tuy nhi??n, v?? m???t s??? l?? do ch??ng t??i ch??a th??? ph?? duy???t th??ng tin tr??n.
        Hi v???ng ch??ng ta c?? th??? h???p trong th???i gian s???p t???i.
    </p>`
  );
  return new SuccessResponse(200, `Store ${storeAccept.name} is denied`).send(
    res
  );
});
export const getAllStores = asyncMiddleware(async (req, res, next) => {
  const { page, perPage } = req.query;
  const stores = await storeService.getAll(null, null, null, page, perPage);
  if (!stores.length) {
    throw new ErrorResponse(400, "No Stores");
  }
  return new SuccessResponse(200, stores).send(res);
});
export const getStoreById = asyncMiddleware(async (req, res, next) => {
  const { storeId } = req.params;
  const store = await storeService.findById(storeId);
  if (!store) {
    throw new ErrorResponse(400, `No staff has id ${storeId}`);
  }
  return new SuccessResponse(200, store).send(res);
});

export const updateStoreById = asyncMiddleware(async (req, res, next) => {
  const { storeId } = req.params;
  if (!storeId.trim()) {
    throw new ErrorResponse(400, "storeId is empty");
  }
  const updatedStore = await storeService.findOneAndUpdate(
    { _id: storeId },
    req.body,
    { new: true }
  );
  if (!updatedStore) {
    throw new ErrorResponse(400, `No staff has id ${storeId}`);
  }
  return new SuccessResponse(200, updatedStore).send(res);
});

export const deleteStoreById = asyncMiddleware(async (req, res, next) => {
  const { storeId } = req.params;
  const deletedStore = await storeService.findOneAndUpdate(
    { _id: storeId, status: "active" },
    { status: "disable" },
    { new: true }
  );
  if (!deletedStore) {
    throw new ErrorResponse(404, "No store");
  }
  return new SuccessResponse(200, `Deleted Store has id ${storeId}`).send(res);
});
