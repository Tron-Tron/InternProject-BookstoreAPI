import { baseService } from "../utils/baseService.js";
import { Product } from "./productModel.js";
export const productService = baseService.bind(null, Product)();
