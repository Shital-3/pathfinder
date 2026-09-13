import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import aiService from "../services/ai.service.js";

export const advisor = asyncHandler(async (req, res) => success(res, await aiService.advisor(req.body), "AI advice generated"));
export const analyzeExperience = asyncHandler(async (req, res) => success(res, await aiService.analyzeExperience(req.body), "Experience analyzed"));
export const similar = asyncHandler(async (req, res) => success(res, await aiService.similar(req.params.id), "Similar experiences found"));
