import authService from "../services/auth.service.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { recordFailedLogin, clearFailedLogins } from "../middleware/loginRateLimiter.js";

const COOKIE_NAME = "pathfinder_session";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

function setSessionCookie(res, token) {
  const sameSite = process.env.COOKIE_SAME_SITE || "Lax";
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${COOKIE_MAX_AGE / 1000}; Path=/; HttpOnly; SameSite=${sameSite}${secure}`);
}

function clearSessionCookie(res) {
  const sameSite = process.env.COOKIE_SAME_SITE || "Lax";
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=${sameSite}${secure}`);
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(validateRegister(req.body));
  setSessionCookie(res, result.token);
  return success(res, result, "Account created", 201);
});

export const login = asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(validateLogin(req.body));
    setSessionCookie(res, result.token);
    clearFailedLogins(req);
    return success(res, result, "Signed in");
  } catch (error) {
    if (error.statusCode === 401) recordFailedLogin(req);
    throw error;
  }
});

export const me = asyncHandler(async (req, res) => success(res, req.user));

export const logout = asyncHandler(async (req, res) => {
  clearSessionCookie(res);
  return success(res, {}, "Signed out");
});
