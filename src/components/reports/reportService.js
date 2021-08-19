import { baseService } from "../utils/baseService.js";
import Report from "./reportModel.js";
export const reportService = baseService.bind(null, Report)();
