import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import categoryValidate from "./categoryValidate.js";
import upload from "../commons/upload.js";
import paginationValidate from "./../utils/paginationValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import {
  createCategory,
  approveCategory,
  rejectCategory,
  getCategoryStoreById,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
} from "./categoryController.js";

const router = express.Router();
const routerStore = express.Router();
const routerAdmin = express.Router();
router.use("/store", routerStore);
routerStore.use(jwtAuth, authorize("manager", "officer"));
routerStore.post(
  "/",
  validateMiddleware(categoryValidate.postCategory, "body"),
  createCategory
);
routerStore.get(
  "/all",
  validateMiddleware(paginationValidate.paging, "query"),
  getAllCategories
);
routerStore.get(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  getCategoryStoreById
);
routerStore.patch(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  updateCategoryById
);
routerStore.delete(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  deleteCategoryById
);
router.use("/admin", routerAdmin);
routerAdmin.use(jwtAuth, authorize("admin"));
routerAdmin.post(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  approveCategory
);
routerAdmin.delete(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  rejectCategory
);

export default router;
