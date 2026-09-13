import test from "node:test";
import assert from "node:assert/strict";
import { validateAdvisorOutput, validateAnalyzerOutput } from "../src/utils/aiOutput.js";

test("validates advisor output", () => {
  const result = validateAdvisorOutput({ recommendation: "Choose a sequence", reasons: ["Reason"], actionPlan: ["Act"], evidence: [{ id: "1", takeaway: "Useful evidence" }] });
  assert.equal(result.recommendation, "Choose a sequence");
});

test("rejects malformed advisor output", () => {
  assert.throws(() => validateAdvisorOutput({ recommendation: "ok", reasons: "bad", actionPlan: [], evidence: [] }), /reasons/);
});

test("validates analyzer output", () => {
  const result = validateAnalyzerOutput({ strengths: ["Clear"], gaps: [], suggestions: ["Add detail"], improvedOutcome: "Outcome", improvedLesson: "Lesson" });
  assert.deepEqual(result.gaps, []);
});

test("rejects malformed analyzer output", () => {
  assert.throws(() => validateAnalyzerOutput({ strengths: [], gaps: [], suggestions: [], improvedOutcome: 42, improvedLesson: "Lesson" }), /improvement/);
});
