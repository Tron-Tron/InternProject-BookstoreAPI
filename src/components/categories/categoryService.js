import { baseService } from "../utils/baseService.js";
import Category from "./categoryModel.js";
export const categoryService = baseService.bind(null, Category)();
