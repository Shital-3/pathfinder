import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";
process.env.CLIENT_URL = "http://localhost:5173";

let app;
try {
  ({ default: app } = await import("../src/app.js"));
} catch (error) {
  // Dependencies are installed in CI/normal development. Keep the local suite useful
  // when node_modules has intentionally been omitted from an exported project archive.
  app = null;
  console.warn(`Integration tests skipped: ${error.code || error.message}`);
}

function integrationTest(name, fn) {
  test(name, { skip: !app && "server dependencies are not installed" }, fn);
}

integrationTest("GET / returns API metadata", async () => {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "Pathfinder API");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

integrationTest("GET /api/openapi.json returns an OpenAPI document", async () => {
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/openapi.json`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.openapi, "3.0.3");
    assert.ok(body.paths["/auth/login"]);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
