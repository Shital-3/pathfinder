import ApiError from "../utils/ApiError.js";

export function parsePagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  return { page, limit, offset: (page - 1) * limit };
}

export function validateSlug(slug) {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new ApiError(400, "Invalid slug");
  return slug;
}
