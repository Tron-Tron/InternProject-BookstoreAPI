import express from "express";
import authorize from "../../middleware/authorize.js";
import jwtAuth from "../../middleware/jwtAuth.js";
import categoryValidate from "./categoryValidate.js";
import paginationValidate from "./../utils/paginationValidate.js";
import validateMiddleware from "../commons/validateMiddleware.js";
import {
  createCategory,
  rejectCategory,
  getCategoryStoreById,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  getAllCategoriesSystem,
} from "./categoryController.js";
import checkActiveStore from "../commons/checkActiveStore.js";
const router = express.Router();
const routerStore = express.Router();
const routerAdmin = express.Router();
router.use("/store", routerStore);
routerStore.use(jwtAuth, authorize("manager", "officer"));
routerStore.post(
  "/",
  checkActiveStore,
  validateMiddleware(categoryValidate.postCategory, "body"),
  createCategory
);
routerStore.get(
  "/all",
  checkActiveStore,
  validateMiddleware(paginationValidate.paging, "query"),
  getAllCategories
);
routerStore.get(
  "/:categoryId",
  checkActiveStore,
  validateMiddleware(categoryValidate.paramCategory, "params"),
  getCategoryStoreById
);
routerStore.patch(
  "/:categoryId",
  checkActiveStore,
  validateMiddleware(categoryValidate.paramCategory, "params"),
  updateCategoryById
);
routerStore.delete(
  "/:categoryId",
  checkActiveStore,
  validateMiddleware(categoryValidate.paramCategory, "params"),
  deleteCategoryById
);
router.use("/admin", routerAdmin);
routerAdmin.use(jwtAuth, authorize("admin"));
routerAdmin.get(
  "/all",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  getAllCategoriesSystem
);
routerAdmin.delete(
  "/:categoryId",
  validateMiddleware(categoryValidate.paramCategory, "params"),
  rejectCategory
);

export default router;
