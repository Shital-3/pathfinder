import pool from "../config/db.js";

function buildFilters({ search = "", category = "" }) {
  const params = [];
  const where = ["d.status = 'PUBLISHED'"];
  if (search) {
    where.push("(d.title LIKE ? OR d.description LIKE ? OR EXISTS (SELECT 1 FROM dilemma_tags dt2 JOIN tags t2 ON t2.id = dt2.tag_id WHERE dt2.dilemma_id = d.id AND t2.name LIKE ?))");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push("(c.name = ? OR EXISTS (SELECT 1 FROM dilemma_tags dt3 JOIN tags t3 ON t3.id = dt3.tag_id WHERE dt3.dilemma_id = d.id AND t3.name = ?))");
    params.push(category, category);
  }
  return { where, params };
}

function shapeRow(row) {
  const total = Number(row.experience_count);
  const aCount = Number(row.option_a_count || 0);
  const bCount = Number(row.option_b_count || 0);
  row.experienceCount = total;
  row.left = { label: row.option_a || "Option A", percent: total ? Math.round((aCount / total) * 100) : 0 };
  row.right = { label: row.option_b || "Option B", percent: total ? Math.round((bCount / total) * 100) : 0 };
  row.tags = row.tags_csv ? row.tags_csv.split("||").filter(Boolean) : [];
  delete row.experience_count;
  delete row.option_a;
  delete row.option_b;
  delete row.option_a_count;
  delete row.option_b_count;
  delete row.tags_csv;
  return row;
}

const optionA = "(SELECT o.label FROM dilemma_options o WHERE o.dilemma_id = d.id ORDER BY o.display_order LIMIT 1)";
const optionB = "(SELECT o.label FROM dilemma_options o WHERE o.dilemma_id = d.id ORDER BY o.display_order LIMIT 1 OFFSET 1)";

const DilemmaModel = {
  async list({ search = "", category = "", sort = "recommended", limit, offset }) {
    const { where, params } = buildFilters({ search, category });
    const order = sort === "most_experiences" ? "experience_count DESC" : sort === "recent" ? "d.created_at DESC" : "d.title ASC";
    const [rows] = await pool.execute(`
      SELECT d.id, d.slug, d.title, d.description, d.context,
        c.name AS category,
        COUNT(DISTINCT CASE WHEN e.status = 'PUBLISHED' THEN e.id END) AS experience_count,
        ${optionA} AS option_a,
        ${optionB} AS option_b,
        COUNT(DISTINCT CASE WHEN e.status = 'PUBLISHED' AND e.decision = ${optionA} THEN e.id END) AS option_a_count,
        COUNT(DISTINCT CASE WHEN e.status = 'PUBLISHED' AND e.decision = ${optionB} THEN e.id END) AS option_b_count,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR '||') AS tags_csv
      FROM dilemmas d
      JOIN categories c ON c.id = d.category_id
      LEFT JOIN experiences e ON e.dilemma_id = d.id
      LEFT JOIN dilemma_tags dt ON dt.dilemma_id = d.id
      LEFT JOIN tags t ON t.id = dt.tag_id
      WHERE ${where.join(" AND ")}
      GROUP BY d.id, d.slug, d.title, d.description, d.context, c.name
      ORDER BY ${order}
      LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return rows.map(shapeRow);
  },

  async count(filters) {
    const { where, params } = buildFilters(filters);
    const [rows] = await pool.execute(`SELECT COUNT(DISTINCT d.id) AS total FROM dilemmas d JOIN categories c ON c.id = d.category_id WHERE ${where.join(" AND ")}`, params);
    return Number(rows[0].total);
  },

  async findBySlug(slug) {
    const [dilemmas] = await pool.execute("SELECT d.*, c.name AS category FROM dilemmas d JOIN categories c ON c.id = d.category_id WHERE d.slug = ? AND d.status = 'PUBLISHED' LIMIT 1", [slug]);
    if (!dilemmas[0]) return null;
    const dilemma = dilemmas[0];
    const [[tags], [options], [tradeoffs]] = await Promise.all([
      pool.execute("SELECT t.name FROM tags t JOIN dilemma_tags dt ON dt.tag_id = t.id WHERE dt.dilemma_id = ? ORDER BY t.name", [dilemma.id]),
      pool.execute("SELECT label, display_order FROM dilemma_options WHERE dilemma_id = ? ORDER BY display_order", [dilemma.id]),
      pool.execute("SELECT metric, left_value, right_value FROM dilemma_tradeoffs WHERE dilemma_id = ? ORDER BY display_order", [dilemma.id]),
    ]);
    return { ...dilemma, tags: tags.map((tag) => tag.name), options, tradeoffs };
  },
};

export default DilemmaModel;
