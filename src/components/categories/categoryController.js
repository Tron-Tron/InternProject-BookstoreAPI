import asyncMiddleware from "../../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SuccessResponse from "../utils/SuccessResponse.js";
import { categoryService } from "./categoryService.js";
import { storeService } from "./../store/storeService.js";
import standardizedString from "./../commons/standardizedString.js";
import { productService } from "../products/productService.js";
export const createCategory = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;
  const storeId = req.user.storeId;
  const isExistCategory = await categoryService.findOne({
    name: standardizedString(name),
    store: storeId,
    status: "active",
  });
  if (isExistCategory) {
    throw new ErrorResponse(400, `${name} is exist`);
  }
  const savedCategory = await categoryService.create({
    name: standardizedString(name),
    store: storeId,
  });
  return new SuccessResponse(200, savedCategory).send(res);
});

export const rejectCategory = asyncMiddleware(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryService.findOneAndDelete({
    _id: categoryId,
    status: "active",
  });
  if (!category) {
    throw new ErrorResponse(400, `No requirement has id ${categoryId}`);
  }
  return new SuccessResponse(200, "Requirement Category is rejected").send(res);
});
export const getCategoryStoreById = asyncMiddleware(async (req, res, next) => {
  const { categoryId } = req.params;
  const storeId = req.user.storeId;
  const category = await categoryService.findOne(
    { _id: categoryId, store: storeId, status: "active" },
    "name"
  );
  if (!category) {
    throw new ErrorResponse(404, `No category has id ${categoryId}`);
  }
  return new SuccessResponse(200, category).send(res);
});

export const getAllCategories = asyncMiddleware(async (req, res, next) => {
  const storeId = req.user.storeId;
  const { page, perPage } = req.query;
  const categories = await categoryService.getAll(
    {
      store: storeId,
      status: "active",
    },
    "name",
    null,
    page,
    perPage
  );
  if (!categories.length) {
    throw new ErrorResponse(404, "No categories");
  }
  return new SuccessResponse(200, categories).send(res);
});
export const getAllCategoriesSystem = asyncMiddleware(
  async (req, res, next) => {
    const { page, perPage } = req.query;
    const categories = await categoryService.getAll(
      {
        status: "active",
      },
      null,
      "store_detail",
      page,
      perPage
    );
    if (!categories.length) {
      throw new ErrorResponse(404, "No categories");
    }
    return new SuccessResponse(200, categories).send(res);
  }
);
export const updateCategoryById = asyncMiddleware(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const storeId = req.user.storeId;
  if (!categoryId.trim()) {
    throw new ErrorResponse(400, "categoryId is empty");
  }
  const updatedCategory = await categoryService.findOneAndUpdate(
    { _id: categoryId, status: "active", store: storeId },
    { name: standardizedString(name) },
    { new: true }
  );
  if (!updatedCategory) {
    throw new ErrorResponse(404, `No category has id ${categoryId}`);
  }
  return new SuccessResponse(200, updatedCategory).send(res);
});

export const deleteCategoryById = asyncMiddleware(async (req, res, next) => {
  const { categoryId } = req.params;
  const storeId = req.user.storeId;
  const checkProduct = await productService.findOne({
    category: categoryId,
    status: "active",
  });
  if (checkProduct) {
    throw new ErrorResponse(401, `Cannot delete this category`);
  }
  const deletedCategory = await categoryService.findOneAndUpdate(
    {
      _id: categoryId,
      status: "active",
      store: storeId,
    },
    { status: "disable" }
  );
  if (!deletedCategory) {
    throw new ErrorResponse(400, `No category has id ${categoryId}`);
  }
  return new SuccessResponse(
    200,
    `Category id ${categoryId} is deleted successfully`
  ).send(res);
});
export const restoreCategoryById = asyncMiddleware(async (req, res, next) => {
  const { categoryId } = req.params;
  const storeId = req.user.storeId;
  const restoredCategory = await categoryService.findOneAndUpdate(
    {
      _id: categoryId,
      status: "disable",
      store: storeId,
    },
    { status: "active" }
  );
  if (!restoredCategory) {
    throw new ErrorResponse(400, `No category has id ${categoryId}`);
  }
  return new SuccessResponse(
    200,
    `Category id ${categoryId} is restored successfully`
  ).send(res);
});
