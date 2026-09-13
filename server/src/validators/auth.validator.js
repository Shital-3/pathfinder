import ApiError from "../utils/ApiError.js";

function validateEmail(email) {
  if (!email || !email.includes("@")) throw new ApiError(400, "A valid email is required");
}

function validatePassword(password) {
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");
}

export function validateRegister(body) {
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!name) throw new ApiError(400, "Name is required");
  if (name.length > 120) throw new ApiError(400, "Name must be 120 characters or fewer");
  validateEmail(email);
  validatePassword(password);
  return { name, email, password };
}

export function validateLogin(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  validateEmail(email);
  validatePassword(password);
  return { email, password };
}
