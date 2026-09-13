import pool from "../config/db.js";

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await pool.execute("SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
  },
  async create({ id, email, passwordHash, name }) {
    await pool.execute("INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)", [id, email, passwordHash, name]);
    return this.findById(id);
  },
};

export default UserModel;
