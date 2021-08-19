import { baseService } from "../utils/baseService.js";
import Customer from "./customerModel.js";
export const customerService = baseService.bind(null, Customer)();
