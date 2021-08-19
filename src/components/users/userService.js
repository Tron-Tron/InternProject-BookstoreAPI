import { baseService } from "../utils/baseService.js";
import User from "./userModel.js";
export const userService = baseService.bind(null, User)();
