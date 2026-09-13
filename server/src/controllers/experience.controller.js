import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import experienceService from "../services/experience.service.js";

export const list = asyncHandler(async (req, res) => success(res, await experienceService.list(req.query), "Experiences loaded"));
export const detail = asyncHandler(async (req, res) => success(res, await experienceService.detail(req.params.id), "Experience loaded"));
