import ApiError from "./ApiError.js";

function requireObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(502, "AI returned an invalid response format.");
  }
  return value;
}

function stringArray(value, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new ApiError(502, `AI returned an invalid ${field} format.`);
  }
  return value.map((item) => item.trim());
}

export function validateAdvisorOutput(value) {
  const output = requireObject(value);
  if (typeof output.recommendation !== "string" || !output.recommendation.trim()) {
    throw new ApiError(502, "AI returned an invalid recommendation format.");
  }
  const reasons = stringArray(output.reasons, "reasons");
  const actionPlan = stringArray(output.actionPlan, "actionPlan");
  if (!Array.isArray(output.evidence)) throw new ApiError(502, "AI returned an invalid evidence format.");
  const evidence = output.evidence.map((item) => {
    if (!item || typeof item.id !== "string" || typeof item.takeaway !== "string" || !item.takeaway.trim()) {
      throw new ApiError(502, "AI returned an invalid evidence item.");
    }
    return { id: item.id, takeaway: item.takeaway.trim() };
  });
  return { recommendation: output.recommendation.trim(), reasons, actionPlan, evidence };
}

export function validateAnalyzerOutput(value) {
  const output = requireObject(value);
  const strengths = stringArray(output.strengths, "strengths");
  const gaps = stringArray(output.gaps, "gaps");
  const suggestions = stringArray(output.suggestions, "suggestions");
  if (typeof output.improvedOutcome !== "string" || typeof output.improvedLesson !== "string") {
    throw new ApiError(502, "AI returned an invalid improvement format.");
  }
  return {
    strengths,
    gaps,
    suggestions,
    improvedOutcome: output.improvedOutcome.trim(),
    improvedLesson: output.improvedLesson.trim(),
  };
}
