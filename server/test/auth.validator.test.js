import test from "node:test";
import assert from "node:assert/strict";
import { validateLogin, validateRegister } from "../src/validators/auth.validator.js";

test("normalizes register email", () => {
  const result = validateRegister({ name: " Student ", email: "STUDENT@EXAMPLE.COM", password: "password123" });
  assert.equal(result.name, "Student");
  assert.equal(result.email, "student@example.com");
});

test("rejects registration without a name", () => {
  assert.throws(() => validateRegister({ email: "student@example.com", password: "password123" }), /Name is required/);
});

test("rejects short passwords", () => {
  assert.throws(() => validateLogin({ email: "student@example.com", password: "short" }), /at least 8 characters/);
});

test("rejects malformed emails", () => {
  assert.throws(() => validateLogin({ email: "not-an-email", password: "password123" }), /valid email/);
});
