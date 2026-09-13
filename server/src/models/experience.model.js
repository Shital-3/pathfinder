import pool from "../config/db.js";

const publicSelect = `SELECT e.id, e.author_name, e.author_role, e.decision AS choice, e.quote, e.body, e.background, e.context, e.why_choice, e.what_did, e.what_worked, e.what_did_not, e.what_would_do_differently, e.outcome, e.lesson, e.created_at, d.slug AS dilemma_slug, d.title AS dilemma_title, c.id AS contributor_id, c.name AS contributor_name, c.initials, c.role_title, c.class_year, c.verified FROM experiences e JOIN dilemmas d ON d.id = e.dilemma_id LEFT JOIN contributors c ON c.id = e.contributor_id`;

const ExperienceModel = {
  async list({ limit, offset, dilemmaSlug, choice }) {
    const params = [];
    const where = ["e.status = 'PUBLISHED'", "d.status = 'PUBLISHED'"];
    if (dilemmaSlug) { where.push("d.slug = ?"); params.push(dilemmaSlug); }
    if (choice) { where.push("e.decision = ?"); params.push(choice); }
    const [rows] = await pool.execute(`${publicSelect} WHERE ${where.join(" AND ")} ORDER BY e.created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return rows;
  },
  async count({ dilemmaSlug, choice }) {
    const params = [];
    const where = ["e.status = 'PUBLISHED'", "d.status = 'PUBLISHED'"];
    if (dilemmaSlug) { where.push("d.slug = ?"); params.push(dilemmaSlug); }
    if (choice) { where.push("e.decision = ?"); params.push(choice); }
    const [rows] = await pool.execute(`SELECT COUNT(*) AS total FROM experiences e JOIN dilemmas d ON d.id = e.dilemma_id WHERE ${where.join(" AND ")}`, params);
    return Number(rows[0].total);
  },
  async findPublicById(id) {
    const [rows] = await pool.execute(`${publicSelect} WHERE e.id = ? AND e.status = 'PUBLISHED' LIMIT 1`, [id]);
    return rows[0] || null;
  },
  async create(data, executor = pool) {
    await executor.execute(`INSERT INTO experiences (id, author_user_id, contributor_id, dilemma_id, author_name, author_role, graduation_year, decision, quote, body, background, context, why_choice, what_did, what_worked, what_did_not, what_would_do_differently, outcome, lesson, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`, Object.values(data));
    return data.id;
  },
  async pending() {
    const [rows] = await pool.execute(`${publicSelect} WHERE e.status = 'PENDING' ORDER BY e.created_at ASC`);
    return rows;
  },
  async countByDilemmaDecisions(dilemmaId) {
    const [rows] = await pool.execute(
      `SELECT decision, COUNT(*) AS count
       FROM experiences
       WHERE dilemma_id = ? AND status = 'PUBLISHED'
       GROUP BY decision`,
      [dilemmaId]
    );
    return Object.fromEntries(rows.map((row) => [row.decision, Number(row.count)]));
  },

  async publishedWithEmbeddings({ limit = 100, dilemmaId = null } = {}) {
    const params = [];
    const where = ["e.status = 'PUBLISHED'", "d.status = 'PUBLISHED'"];
    if (dilemmaId) { where.push("e.dilemma_id = ?"); params.push(dilemmaId); }
    const [rows] = await pool.execute(
      `SELECT e.id, e.author_name, e.author_role, e.decision AS choice, e.quote, e.body, e.background, e.context, e.why_choice, e.what_did, e.what_worked, e.what_did_not, e.what_would_do_differently, e.outcome, e.lesson, e.created_at, e.embedding_json, d.slug AS dilemma_slug, d.title AS dilemma_title, c.id AS contributor_id, c.name AS contributor_name, c.initials, c.role_title, c.class_year, c.verified
       FROM experiences e JOIN dilemmas d ON d.id = e.dilemma_id LEFT JOIN contributors c ON c.id = e.contributor_id
       WHERE ${where.join(" AND ")} ORDER BY e.created_at DESC LIMIT ?`,
      [...params, limit]
    );
    return rows;
  },

  async updateEmbedding(id, embedding) {
    await pool.execute("UPDATE experiences SET embedding_json = ? WHERE id = ? AND status = 'PUBLISHED'", [JSON.stringify(embedding), id]);
  },

  async updateStatus(id, status, reviewerId, note = null) {
    const [result] = await pool.execute("UPDATE experiences SET status = ?, reviewed_by = ?, moderation_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'PENDING'", [status, reviewerId, note, id]);
    return result.affectedRows > 0;
  },
};

export default ExperienceModel;