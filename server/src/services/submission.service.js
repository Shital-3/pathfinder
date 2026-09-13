import ApiError from "../utils/ApiError.js";
import ExperienceModel from "../models/experience.model.js";

async function moderate(action, id, reviewerId, note) {
  const updated = action === "approve"
    ? await ExperienceModel.updateStatus(id, "PUBLISHED", reviewerId, note)
    : await ExperienceModel.updateStatus(id, "REJECTED", reviewerId, note);
  if (!updated) throw new ApiError(404, "Pending experience not found");
  return true;
}

export default {
  pending: () => ExperienceModel.pending(),
  approve: (id, reviewerId, note) => moderate("approve", id, reviewerId, note),
  reject: (id, reviewerId, note) => moderate("reject", id, reviewerId, note),
};
