import test from "node:test";
import assert from "node:assert/strict";
import { validateModerationNote } from "../src/validators/moderation.validator.js";

test("allows an optional approval note", () => {
  assert.equal(validateModerationNote({ note: "Looks good" }), "Looks good");
  assert.equal(validateModerationNote({}), null);
});

test("requires a rejection note", () => {
  assert.throws(() => validateModerationNote({}, { required: true }), /required when rejecting/);
});

test("limits moderation note length", () => {
  assert.throws(() => validateModerationNote({ note: "x".repeat(1001) }), /1000 characters/);
});
