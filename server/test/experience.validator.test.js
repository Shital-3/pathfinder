import test from "node:test";
import assert from "node:assert/strict";
import { validateExperience } from "../src/validators/experience.validator.js";

const validExperience = {
  name: "Test Student",
  currentRole: "Final-year B.Tech student",
  graduationYear: "2027",
  dilemmaSlug: "dsa-vs-projects",
  decision: "DSA",
  background: "Computer engineering student",
  context: "Preparing for placements while building projects",
  whyChoice: "I wanted stronger problem-solving fundamentals",
  whatDid: "Practised consistently and tracked progress",
  whatWorked: "Daily focused practice",
  whatDidNot: "I initially ignored project work",
  whatWouldDoDifferently: "I would balance both earlier",
  outcome: "Improved consistency",
  lesson: "Balance depth with practical work",
};

test("accepts a complete valid experience", () => {
  const result = validateExperience(validExperience);
  assert.equal(result.name, "Test Student");
  assert.equal(result.graduationYear, 2027);
});

test("rejects an experience with a missing required field", () => {
  const invalid = { ...validExperience, lesson: "" };
  assert.throws(() => validateExperience(invalid), /lesson is required/);
});

test("rejects a malformed graduation year", () => {
  const invalid = { ...validExperience, graduationYear: "27" };
  assert.throws(() => validateExperience(invalid), /four-digit year/);
});

test("rejects an unsupported graduation year", () => {
  const invalid = { ...validExperience, graduationYear: "1990" };
  assert.throws(() => validateExperience(invalid), /outside the supported range/);
});
