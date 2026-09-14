import cors from "cors";

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://pathfinder-murex-seven.vercel.app",
  "https://pathfinder-fonxd4zxx-shital-3s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

export default cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
});