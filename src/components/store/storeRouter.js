import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import validateMiddleware from "./../commons/validateMiddleware.js";
import storeValidate from "./storeValidate.js";
import {
  addStore,
  acceptStore,
  updateStoreById,
  deleteStoreById,
  getStoreById,
  getAllStores,
} from "./storeController.js";
import paginationValidate from "./../utils/paginationValidate.js";
const router = express.Router();
const routerStore = express.Router();
const routerAdmin = express.Router();
router.use("/manager", routerStore);
routerStore.use(jwtAuth, authorize("manager"));
routerStore.post(
  "/",
  validateMiddleware(storeValidate.postStore, "body"),
  addStore
);
router.use("/admin", routerAdmin);
routerAdmin.use(jwtAuth, authorize("admin"));
routerAdmin.post(
  "/accept-store/:storeId",
  validateMiddleware(storeValidate.paramStore, "params"),
  acceptStore
);

// router.get(
//   "/all",
//   validateMiddleware(paginationValidate.paging, "query"),
//   getAllStores
// );
// router.get(
//   "/:storeId",
//   validateMiddleware(storeValidate.paramStore, "params"),
//   getStoreById
// );
// router.patch(
//   "/:storeId",
//   validateMiddleware(storeValidate.paramStore, "params"),
//   updateStoreById
// );
// router.delete(
//   "/:storeId",
//   validateMiddleware(storeValidate.paramStore, "params"),
//   deleteStoreById
// );

export default router;
