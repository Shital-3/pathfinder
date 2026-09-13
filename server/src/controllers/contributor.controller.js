import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import contributorService from "../services/contributor.service.js";

export const list = asyncHandler(async (req, res) => success(res, await contributorService.list(req.query), "Contributors loaded"));
export const detail = asyncHandler(async (req, res) => success(res, await contributorService.detail(req.params.id), "Contributor loaded"));
export const experiences = detail;
