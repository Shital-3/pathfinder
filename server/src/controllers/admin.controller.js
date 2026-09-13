import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import submissionService from "../services/submission.service.js";
import { validateModerationNote } from "../validators/moderation.validator.js";

export const pending = asyncHandler(async (req, res) => success(res, { items: await submissionService.pending() }, "Pending experiences loaded"));
export const approve = asyncHandler(async (req, res) => success(res, { updated: await submissionService.approve(req.params.id, req.user.id, validateModerationNote(req.body)) }, "Experience approved"));
export const reject = asyncHandler(async (req, res) => success(res, { updated: await submissionService.reject(req.params.id, req.user.id, validateModerationNote(req.body, { required: true })) }, "Experience rejected"));
