import { baseService } from "../utils/baseService.js";
import Store from "./storeModel.js";
export const storeService = baseService.bind(null, Store)();
