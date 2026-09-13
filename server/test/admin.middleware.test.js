import test from "node:test";
import assert from "node:assert/strict";
import requireAdmin from "../src/middleware/admin.middleware.js";

function run(user) {
  let error = null;
  requireAdmin({ user }, {}, (err) => { error = err; });
  return error || null;
}

test("allows an ADMIN user", () => {
  assert.equal(run({ id: "1", role: "ADMIN" }), null);
});

test("rejects a non-admin user", () => {
  const error = run({ id: "2", role: "USER" });
  assert.equal(error.statusCode, 403);
  assert.match(error.message, /Administrator access required/);
});
