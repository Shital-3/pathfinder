import "dotenv/config";
import app from "./src/app.js";

const port = Number(process.env.PORT || 5000);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Pathfinder API listening on port ${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Closing HTTP server...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));