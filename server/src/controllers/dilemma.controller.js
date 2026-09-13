import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import dilemmaService from "../services/dilemma.service.js";

export const list = asyncHandler(async (req, res) => success(res, await dilemmaService.list(req.query), "Dilemmas loaded"));
export const detail = asyncHandler(async (req, res) => success(res, await dilemmaService.detail(req.params.slug), "Dilemma loaded"));
