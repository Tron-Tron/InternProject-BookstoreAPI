import { baseService } from "../utils/baseService.js";
import Order from "./orderModel.js";
export const orderService = baseService.bind(null, Order)();
