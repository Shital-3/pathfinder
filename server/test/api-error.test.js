import test from "node:test";
import assert from "node:assert/strict";
import ApiError from "../src/utils/ApiError.js";

test("ApiError preserves status code and message", () => {
  const error = new ApiError(409, "Conflict");
  assert.equal(error.statusCode, 409);
  assert.equal(error.message, "Conflict");
});
