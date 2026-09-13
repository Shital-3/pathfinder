import ApiError from "../utils/ApiError.js";
import ContributorModel from "../models/contributor.model.js";
import ExperienceModel from "../models/experience.model.js";

export default {
  async list(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 12, 1), 50);
    const search = String(query.search || "").trim();
    const [items, total] = await Promise.all([ContributorModel.list({ search, limit, offset: (page - 1) * limit }), ContributorModel.count(search)]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  async detail(id) {
    const contributor = await ContributorModel.findById(id);
    if (!contributor) throw new ApiError(404, "Contributor not found");
    const experiences = await ExperienceModel.list({ limit: 100, offset: 0 });
    return { contributor, experiences: experiences.filter((item) => item.contributor_id === id) };
  },
};
