import { baseService } from "../utils/baseService.js";
import Auth from "./authModel.js";
export const authService = baseService.bind(null, Auth)();
