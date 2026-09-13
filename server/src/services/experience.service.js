import { randomUUID } from "node:crypto";
import ApiError from "../utils/ApiError.js";
import ExperienceModel from "../models/experience.model.js";
import ContributorModel from "../models/contributor.model.js";
import pool from "../config/db.js";

export default {
  async list(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
    const filters = { dilemmaSlug: query.dilemma, choice: query.choice };
    const [items, total] = await Promise.all([ExperienceModel.list({ ...filters, limit, offset: (page - 1) * limit }), ExperienceModel.count(filters)]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },
  async detail(id) {
    const experience = await ExperienceModel.findPublicById(id);
    if (!experience) throw new ApiError(404, "Experience not found");
    return experience;
  },
  async submit(data, userId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [dilemmas] = await connection.execute(
        "SELECT id FROM dilemmas WHERE slug = ? AND status = 'PUBLISHED' LIMIT 1",
        [data.dilemmaSlug]
      );
      if (!dilemmas[0]) {
        throw new ApiError(404, "Dilemma not found");
      }

      const [options] = await connection.execute(
        "SELECT label FROM dilemma_options WHERE dilemma_id = ? ORDER BY display_order",
        [dilemmas[0].id]
      );
      if (!options.some((option) => option.label === data.decision)) {
        throw new ApiError(400, "Selected decision is not valid for this dilemma");
      }

      const contributorId = await ContributorModel.upsertForUser({
        userId,
        name: data.name,
        roleTitle: data.currentRole,
        classYear: data.graduationYear,
        background: data.background,
      }, connection);

      const id = randomUUID();
      await ExperienceModel.create({
        id,
        authorUserId: userId,
        contributorId,
        dilemmaId: dilemmas[0].id,
        authorName: data.name,
        authorRole: data.currentRole,
        graduationYear: data.graduationYear,
        decision: data.decision,
        quote: data.lesson,
        body: data.outcome,
        background: data.background,
        context: data.context,
        whyChoice: data.whyChoice,
        whatDid: data.whatDid,
        whatWorked: data.whatWorked,
        whatDidNot: data.whatDidNot,
        whatWouldDoDifferently: data.whatWouldDoDifferently,
        outcome: data.outcome,
        lesson: data.lesson,
      }, connection);

      await connection.commit();
      return { id, status: "PENDING", contributorId, dilemmaSlug: data.dilemmaSlug };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
