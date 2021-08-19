import { baseService } from "../utils/baseService.js";
import TransferRequirement from "./transferRequirementModel.js";
export const transferRequirementService = baseService.bind(
  null,
  TransferRequirement
)();
