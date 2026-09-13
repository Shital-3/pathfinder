import { checkDatabaseConnection } from "../config/db.js";

export async function getHealth(req, res, next) {
  try {
    const database = await checkDatabaseConnection();
    const healthy = database.connected;

    res.status(healthy ? 200 : 503).json({
      success: healthy,
      message: healthy ? "API is healthy" : "API is running but database is unavailable",
      data: {
        server: "running",
        api: "available",
        database: database.connected ? "connected" : "unavailable",
        ...(database.error ? { databaseError: database.error } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
}
