const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",

    // Vercel production frontend
    "https://pathfinder-murex-seven.vercel.app",

    // Vercel preview/project deployment
    "https://pathfinder-l3x76extu-shital-3s-projects.vercel.app",
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