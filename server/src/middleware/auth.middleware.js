import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, bearerToken] = header.split(" ");
    const cookieHeader = req.headers.cookie || "";
    const cookieToken = cookieHeader.match(/(?:^|;\s*)pathfinder_session=([^;]+)/)?.[1];
    const token = scheme === "Bearer" && bearerToken ? bearerToken : cookieToken ? decodeURIComponent(cookieToken) : null;
    if (!token) throw new ApiError(401, "Authentication required");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(payload.id);
    if (!user) throw new ApiError(401, "User account not found");

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
}
