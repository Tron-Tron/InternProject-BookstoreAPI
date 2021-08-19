import { baseService } from "../utils/baseService.js";
import Staff from "./staffModel.js";
export const staffService = baseService.bind(null, Staff)();
