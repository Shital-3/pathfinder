import ApiError from "../utils/ApiError.js";
import DilemmaModel from "../models/dilemma.model.js";
import ExperienceModel from "../models/experience.model.js";

export default {
  async list(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
    const filters = { search: String(query.search || "").trim(), category: String(query.category || "").trim(), sort: query.sort };
    const [items, total] = await Promise.all([
      DilemmaModel.list({ ...filters, limit, offset: (page - 1) * limit }),
      DilemmaModel.count(filters),
    ]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  async detail(slug) {
    const dilemma = await DilemmaModel.findBySlug(slug);
    if (!dilemma) throw new ApiError(404, "Dilemma not found");
    const [experiences, counts] = await Promise.all([
      ExperienceModel.list({ dilemmaSlug: slug, limit: 100, offset: 0 }),
      ExperienceModel.countByDilemmaDecisions(dilemma.id),
    ]);
    const distribution = dilemma.options.map((option) => ({ label: option.label, count: counts[option.label] || 0 }));
    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    return {
      ...dilemma,
      experienceCount: total,
      distribution: distribution.map((item) => ({ ...item, percentage: total ? Math.round((item.count / total) * 100) : 0 })),
      experiences,
    };
  },
};
