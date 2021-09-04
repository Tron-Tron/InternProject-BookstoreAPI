import asyncMiddleware from "../../middleware/asyncMiddleware.js";

import SuccessResponse from "../utils/SuccessResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { categoryService } from "../categories/categoryService.js";
import { productService } from "./productService.js";
import search from "./../utils/search.js";
import standardizedString from "./../commons/standardizedString.js";
export const createNewProduct = asyncMiddleware(async (req, res, next) => {
  const { name, price, category, amount, description, author } = req.body;
  const store = req.user.storeId;
  const checkCategory = await categoryService.findOne({
    _id: category,
    status: "active",
    store,
  });
  if (!checkCategory) {
    throw new ErrorResponse(400, "Category is not exist");
  }
  const isExistProduct = await productService.findOne({
    name,
    store,
    status: "active",
  });
  if (isExistProduct) {
    throw new ErrorResponse(400, `${name} is exist`);
  }
  if (!req.files) {
    throw new ErrorResponse(500, "No file");
  }
  if (amount < 1) {
    throw new ErrorResponse(401, "amount must be greater than 0");
  }
  const image = req.files.map((val) => {
    return val.filename;
  });
  const createdProduct = await productService.create({
    name: standardizedString(name),
    price,
    author: standardizedString(author),
    category,
    store,
    amount,
    description,
    image,
  });
  return new SuccessResponse(200, createdProduct).send(res);
});

export const rejectProduct = asyncMiddleware(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productService.findOneAndDelete({
    _id: productId,
    status: "active",
  });
  if (!product) {
    throw new ErrorResponse(400, `No requirement has id ${productId}`);
  }
  return new SuccessResponse(200, "Requirement Product is rejected").send(res);
});

export const getAllProducts = asyncMiddleware(async (req, res, next) => {
  const storeId = req.user.storeId;
  const { page, perPage } = req.query;
  const products = await productService.getAll(
    { store: storeId, status: "active" },
    null,
    "category_detail",
    page,
    perPage
  );
  if (!products.length) {
    throw new ErrorResponse(400, "No Products");
  }
  return new SuccessResponse(200, products).send(res);
});

export const getProductById = asyncMiddleware(async (req, res, next) => {
  const { productId } = req.params;
  const storeId = req.user.storeId;
  const product = await productService.findOne(
    { _id: productId, store: storeId, status: "active" },
    null,
    "category_detail"
  );

  if (!product) {
    throw new ErrorResponse(400, `No product has id ${productId}`);
  }
  return new SuccessResponse(200, product).send(res);
});

export const deleteProductById = asyncMiddleware(async (req, res, next) => {
  const { productId } = req.params;
  const storeId = req.user.storeId;
  if (!productId.trim()) {
    throw new ErrorResponse(400, "productId is empty");
  }
  const deletedProduct = await productService.findOneAndUpdate(
    {
      _id: productId,
      store: storeId,
    },
    { status: "deleted" }
  );
  if (!deletedProduct) {
    throw new ErrorResponse(400, `No product has id ${productId}`);
  }
  return new SuccessResponse(200, "Delete Successfully").send(res);
});

export const updateProductById = asyncMiddleware(async (req, res, next) => {
  const { productId } = req.params;
  const storeId = req.user.storeId;
  const updatedProduct = await productService.findOneAndUpdate(
    { _id: productId, store: storeId, status: "active" },
    req.body,
    { new: true }
  );
  if (!updatedProduct) {
    throw new ErrorResponse(404, `No product has id ${productId}`);
  }
  return new SuccessResponse(200, updatedProduct).send(res);
});
export const searchProductByName = asyncMiddleware(async (req, res, next) => {
  const { keyName, page, perPage } = req.query;
  // const storeId = req.user.storeId;
  const productArr = await productService.getAll(
    {
      //     store: storeId,
      status: "active",
    },
    "name",
    null,
    page,
    perPage
  );
  console.log(productArr);
  const searchedProduct = productArr.filter((value) => {
    return value.name.toLowerCase().indexOf(keyName.toLowerCase()) !== -1;
  });
  if (searchedProduct.length === 0) {
    throw new ErrorResponse(400, "No Products");
  }
  return new SuccessResponse(200, searchedProduct).send(res);
});
export const searchByPrice = asyncMiddleware(async (req, res, next) => {
  const { page, perPage, min, max } = req.query;
  const storeId = req.user.storeId;
  const productArr = await productService.getAll(
    { store: storeId, status: "active", price: { $gte: min, $lte: max } },
    "name price",
    null,
    page,
    perPage
  );
  return new SuccessResponse(200, productArr).send(res);
});
