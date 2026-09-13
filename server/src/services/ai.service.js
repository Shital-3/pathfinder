import ApiError from "../utils/ApiError.js";
import ExperienceModel from "../models/experience.model.js";
import DilemmaModel from "../models/dilemma.model.js";
import { validateAdvisorOutput, validateAnalyzerOutput } from "../utils/aiOutput.js";

const OPENAI_URL = "https://api.openai.com/v1";
const TEXT_MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

function requireKey() {
  if (!process.env.OPENAI_API_KEY) throw new ApiError(503, "AI features are not configured. Add OPENAI_API_KEY to the server environment.");
}

async function openAI(path, body) {
  requireKey();
  const response = await fetch(`${OPENAI_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(502, payload?.error?.message || "AI service request failed");
  return payload;
}

function outputText(response) {
  if (typeof response.output_text === "string") return response.output_text;
  const parts = [];
  for (const item of response.output || []) for (const content of item.content || []) {
    if (content.type === "output_text" && content.text) parts.push(content.text);
  }
  return parts.join("\n").trim();
}

function parseJson(text) {
  try { return JSON.parse(text); } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new ApiError(502, "AI returned an invalid response format.");
  try { return JSON.parse(match[0]); } catch { throw new ApiError(502, "AI returned an invalid response format."); }
}

function experienceContext(item) {
  return [
    `ID: ${item.id}`,
    `Choice: ${item.choice}`,
    `Quote: ${item.quote || ""}`,
    `Outcome: ${item.outcome || item.body || ""}`,
    `Lesson: ${item.lesson || ""}`,
    `Contributor: ${item.contributor_name || item.author_name || "Anonymous"}`,
  ].join("\n");
}

function readEmbedding(value) {
  if (!value) return null;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(parsed) || !parsed.length || parsed.some((n) => typeof n !== "number" || !Number.isFinite(n))) return null;
    return parsed;
  } catch { return null; }
}

async function ensureEmbeddings(items) {
  const missing = items.filter((item) => !readEmbedding(item.embedding_json));
  if (missing.length) {
    const response = await openAI("/embeddings", { model: EMBEDDING_MODEL, input: missing.map(experienceContext) });
    const vectors = response.data || [];
    if (vectors.length !== missing.length) throw new ApiError(502, "AI similarity service returned incomplete embeddings.");
    await Promise.all(missing.map((item, index) => {
      item.embedding_json = vectors[index].embedding;
      return ExperienceModel.updateEmbedding(item.id, vectors[index].embedding);
    }));
  }
  return items.map((item) => ({ ...item, embedding: readEmbedding(item.embedding_json) })).filter((item) => item.embedding);
}

function cosine(a, b) {
  if (a.length !== b.length) return 0;
  let dot = 0; let aa = 0; let bb = 0;
  for (let i = 0; i < a.length; i += 1) { dot += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; }
  return dot / ((Math.sqrt(aa) * Math.sqrt(bb)) || 1);
}

export default {
  async advisor({ dilemmaSlug, question, profile = "" }) {
    if (!question?.trim()) throw new ApiError(400, "Tell Pathfinder what you are deciding.");
    const dilemma = await DilemmaModel.findBySlug(dilemmaSlug);
    if (!dilemma) throw new ApiError(404, "Dilemma not found");
    const { items } = await ExperienceModel.list({ limit: 20, offset: 0, dilemmaSlug });
    const response = await openAI("/responses", {
      model: TEXT_MODEL,
      instructions: "You are Pathfinder AI, a decision-support assistant for students. Do not make absolute career promises. Use the supplied Pathfinder experiences as evidence, clearly separate community evidence from your reasoning, and give a practical next step. Return valid JSON only with keys: recommendation, reasons (array of strings), actionPlan (array of strings), evidence (array of objects with id and takeaway).",
      input: `DILEMMA:\n${dilemma.title}\n${dilemma.description}\n\nSTUDENT PROFILE:\n${profile || "Not provided"}\n\nSTUDENT QUESTION:\n${question}\n\nPUBLISHED PATHFINDER EXPERIENCES:\n${items.map(experienceContext).join("\n\n") || "No published experiences yet."}`,
    });
    return validateAdvisorOutput(parseJson(outputText(response)));
  },

  async analyzeExperience(data) {
    const content = Object.entries(data || {}).filter(([, value]) => typeof value === "string" && value.trim()).map(([key, value]) => `${key}: ${value}`).join("\n");
    if (content.length < 80) throw new ApiError(400, "Add a little more of your experience before using the analyzer.");
    const response = await openAI("/responses", {
      model: TEXT_MODEL,
      instructions: "You are an editor helping students write honest first-person career experiences. Do not invent achievements, numbers, companies, or outcomes. Return valid JSON only with keys: strengths (array), gaps (array), suggestions (array), improvedOutcome (string), improvedLesson (string). Preserve the student's meaning and voice.",
      input: `Review this Pathfinder experience:\n\n${content}`,
    });
    return validateAnalyzerOutput(parseJson(outputText(response)));
  },

  async similar(id) {
    const target = await ExperienceModel.findPublicById(id);
    if (!target) throw new ApiError(404, "Experience not found");
    const candidates = await ExperienceModel.publishedWithEmbeddings({ limit: 50 });
    const others = candidates.filter((item) => item.id !== id);
    if (!others.length) return [];
    const all = await ensureEmbeddings([target, ...others]);
    const hydratedTarget = all.find((item) => item.id === id);
    if (!hydratedTarget) throw new ApiError(502, "AI similarity service could not embed the target experience.");
    return all.filter((item) => item.id !== id).map((item) => ({
      id: item.id,
      similarity: Number(cosine(hydratedTarget.embedding, item.embedding).toFixed(3)),
      choice: item.choice,
      quote: item.quote || item.lesson,
      body: item.body || item.outcome,
      contributor: { id: item.contributor_id, name: item.contributor_name || item.author_name || "Anonymous contributor", initials: item.initials || (item.contributor_name || "A").slice(0, 2).toUpperCase(), role: item.role_title || item.author_role || "Student contributor", verified: Boolean(item.verified) },
    })).sort((a, b) => b.similarity - a.similarity).slice(0, 3);
  },
};
