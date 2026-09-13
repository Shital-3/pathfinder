import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import experienceService from "../services/experience.service.js";
import { validateExperience } from "../validators/experience.validator.js";

export const submit = asyncHandler(async (req, res) => success(res, { experience: await experienceService.submit(validateExperience(req.body), req.user.id) }, "Experience submitted for review", 201));
