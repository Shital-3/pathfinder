import pool from "../config/db.js";

const ContributorModel = {
  async list({ limit, offset, search = "" }) {
    const params = [];
    const where = ["1 = 1"];
    if (search) {
      where.push("(c.name LIKE ? OR c.role_title LIKE ? OR c.bio LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const [rows] = await pool.execute(
      `SELECT c.*, COUNT(DISTINCT CASE WHEN e.status = 'PUBLISHED' THEN e.id END) AS experience_count,
              GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR '||') AS tags_csv
       FROM contributors c
       LEFT JOIN experiences e ON e.contributor_id = c.id
       LEFT JOIN contributor_tags ct ON ct.contributor_id = c.id
       LEFT JOIN tags t ON t.id = ct.tag_id
       WHERE ${where.join(" AND ")}
       GROUP BY c.id
       ORDER BY c.name
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return rows.map((row) => {
      row.tags = row.tags_csv ? row.tags_csv.split("||").filter(Boolean) : [];
      delete row.tags_csv;
      return row;
    });
  },

  async count(search = "") {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) AS total FROM contributors WHERE name LIKE ? OR role_title LIKE ? OR bio LIKE ?",
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    return Number(rows[0].total);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, COUNT(DISTINCT CASE WHEN e.status = 'PUBLISHED' THEN e.id END) AS experience_count,
              GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR '||') AS tags_csv
       FROM contributors c
       LEFT JOIN experiences e ON e.contributor_id = c.id
       LEFT JOIN contributor_tags ct ON ct.contributor_id = c.id
       LEFT JOIN tags t ON t.id = ct.tag_id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );
    if (!rows[0]) return null;
    rows[0].tags = rows[0].tags_csv ? rows[0].tags_csv.split("||").filter(Boolean) : [];
    delete rows[0].tags_csv;
    return rows[0];
  },

  async findByUserId(userId, executor = pool) {
    const [rows] = await executor.execute("SELECT * FROM contributors WHERE user_id = ? LIMIT 1", [userId]);
    return rows[0] || null;
  },

  async upsertForUser({ userId, name, roleTitle, classYear, background }, executor = pool) {
    const existing = await this.findByUserId(userId, executor);
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "ST";
    const bio = "Sharing real decisions and lessons from the student journey.";
    if (existing) {
      await executor.execute(
        `UPDATE contributors SET name = ?, initials = ?, role_title = ?, class_year = ?, background = ?, bio = ? WHERE user_id = ?`,
        [name, initials, roleTitle, classYear, background || null, bio, userId]
      );
      return existing.id;
    }
    const { randomUUID } = await import("node:crypto");
    const id = randomUUID();
    await executor.execute(
      `INSERT INTO contributors (id, user_id, name, initials, role_title, bio, class_year, background, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [id, userId, name, initials, roleTitle, bio, classYear || null, background || null]
    );
    return id;
  },
};

export default ContributorModel;
