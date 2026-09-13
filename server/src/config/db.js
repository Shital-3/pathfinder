import "dotenv/config";
import mysql from "mysql2/promise";

const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

const pool = connectionUrl
  ? mysql.createPool({
      uri: connectionUrl,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
    })
  : mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "pathfinder",
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
      queueLimit: 0,
    });

export async function checkDatabaseConnection() {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.ping();
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    };
  } finally {
    connection?.release();
  }
}

export default pool;