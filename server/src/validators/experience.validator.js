import ApiError from "../utils/ApiError.js";

const requiredFields = ["name", "currentRole", "dilemmaSlug", "decision", "background", "context", "whyChoice", "whatDid", "whatWorked", "whatDidNot", "whatWouldDoDifferently", "outcome", "lesson"];

export function validateExperience(body) {
  const values = {};
  for (const field of requiredFields) {
    const value = String(body[field] || "").trim();
    if (!value) throw new ApiError(400, `${field} is required`);
    values[field] = value;
  }
  if (body.graduationYear && !/^\d{4}$/.test(String(body.graduationYear))) {
    throw new ApiError(400, "graduationYear must be a four-digit year");
  }
  if (body.graduationYear) {
    const year = Number(body.graduationYear);
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 10) {
      throw new ApiError(400, "graduationYear is outside the supported range");
    }
  }
  return { ...values, graduationYear: body.graduationYear ? Number(body.graduationYear) : null };
}
