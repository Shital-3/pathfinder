import { Router } from "express";

const router = Router();

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Pathfinder API",
    version: "1.0.0",
    description: "REST API for the Pathfinder student decision and experience platform.",
  },
  servers: [{ url: "/api" }],
  tags: [
    { name: "Health" }, { name: "Auth" }, { name: "Dilemmas" },
    { name: "Experiences" }, { name: "Contributors" }, { name: "Admin" }, { name: "AI" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      sessionCookie: { type: "apiKey", in: "cookie", name: "pathfinder_session" },
    },
  },
  paths: {
    "/health": { get: { tags: ["Health"], summary: "Check API health", responses: { "200": { description: "Healthy" } } } },
    "/auth/register": { post: { tags: ["Auth"], summary: "Create a user account", responses: { "201": { description: "Account created" }, "409": { description: "Email already exists" } } } },
    "/auth/login": { post: { tags: ["Auth"], summary: "Sign in and create a session", responses: { "200": { description: "Signed in" }, "401": { description: "Invalid credentials" } } } },
    "/auth/me": { get: { tags: ["Auth"], summary: "Get current user", security: [{ sessionCookie: [] }, { bearerAuth: [] }], responses: { "200": { description: "Current user" }, "401": { description: "Unauthenticated" } } } },
    "/auth/logout": { post: { tags: ["Auth"], summary: "Clear the session cookie", responses: { "200": { description: "Signed out" } } } },
    "/dilemmas": { get: { tags: ["Dilemmas"], summary: "List published dilemmas" } },
    "/dilemmas/{slug}": { get: { tags: ["Dilemmas"], summary: "Get a dilemma by slug", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }] } },
    "/experiences": { get: { tags: ["Experiences"], summary: "List published experiences" } },
    "/experiences/{id}": { get: { tags: ["Experiences"], summary: "Get a published experience", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] } },
    "/experiences/submit": { post: { tags: ["Experiences"], summary: "Submit an experience for moderation", security: [{ sessionCookie: [] }, { bearerAuth: [] }], responses: { "201": { description: "Submission created" }, "401": { description: "Unauthenticated" } } } },
    "/contributors": { get: { tags: ["Contributors"], summary: "List contributors" } },
    "/contributors/{id}": { get: { tags: ["Contributors"], summary: "Get a contributor", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] } },
    "/admin/experiences/pending": { get: { tags: ["Admin"], summary: "List pending experiences", security: [{ sessionCookie: [] }, { bearerAuth: [] }], responses: { "200": { description: "Pending experiences" }, "403": { description: "Admin access required" } } } },
    "/admin/experiences/{id}/approve": { patch: { tags: ["Admin"], summary: "Approve a pending experience", security: [{ sessionCookie: [] }, { bearerAuth: [] }] } },
    "/admin/experiences/{id}/reject": { patch: { tags: ["Admin"], summary: "Reject a pending experience", security: [{ sessionCookie: [] }, { bearerAuth: [] }] } },
    "/ai/advisor": { post: { tags: ["AI"], summary: "Get AI decision guidance", security: [{ sessionCookie: [] }, { bearerAuth: [] }] } },
    "/ai/analyze-experience": { post: { tags: ["AI"], summary: "Analyze an experience draft", security: [{ sessionCookie: [] }, { bearerAuth: [] }] } },
    "/ai/similar/{id}": { get: { tags: ["AI"], summary: "Find similar experiences", security: [{ sessionCookie: [] }, { bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] } },
  },
};

router.get("", (req, res) => res.json(spec));
router.get("/openapi.json", (req, res) => res.json(spec));

export default router;
