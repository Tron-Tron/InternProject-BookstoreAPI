import { baseService } from "../utils/baseService.js";
import StaffRequirement from "./staffRequirementModel.js";
export const staffRequirementService = baseService.bind(
  null,
  StaffRequirement
)();
