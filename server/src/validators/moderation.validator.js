import ApiError from "../utils/ApiError.js";

export function validateModerationNote(body = {}, { required = false } = {}) {
  const note = String(body.note || "").trim();
  if (required && !note) throw new ApiError(400, "A moderation note is required when rejecting an experience");
  if (note.length > 1000) throw new ApiError(400, "Moderation note must be 1000 characters or fewer");
  return note || null;
}
