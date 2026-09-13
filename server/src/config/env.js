import "dotenv/config";

const required = ["JWT_SECRET"];

export function validateEnvironment() {
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }

  if (process.env.JWT_SECRET.trim().length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }

  if (process.env.NODE_ENV === "production" && !process.env.CLIENT_URL?.trim()) {
    throw new Error("CLIENT_URL is required in production.");
  }
}

validateEnvironment();
