# Pathfinder

Pathfinder is a full-stack student decision and experience platform. It helps students explore common academic and career dilemmas through structured, real-world experiences shared by other students.

## Why Pathfinder?

Students often make decisions such as **DSA vs Projects**, **Java vs Python**, or **Internship vs Academics** without enough context from people who have already faced the same choice. Pathfinder turns those isolated decisions into a searchable, moderated knowledge base.

## Core features

- Curated dilemma directory with decision distributions
- Structured student experience submission
- JWT authentication and role-based admin access
- Admin moderation: `PENDING → PUBLISHED / REJECTED`
- Contributor profiles and experience discovery
- AI Dilemma Advisor using published Pathfinder evidence
- AI Experience Analyzer for draft feedback
- Similar Experiences using text embeddings and cosine similarity
- Database-backed pages instead of hardcoded experience content
- Transaction-safe experience submission
- Login and AI rate limiting

## Tech stack

### Frontend

- React 18
- React Router 6
- Vite
- JavaScript
- CSS with reusable project variables
- Lucide React / React Icons

### Backend

- Node.js
- Express 5
- MySQL 8+
- JWT
- bcrypt
- REST APIs

### AI

- OpenAI API
- Text generation for advisor/analyzer
- `text-embedding-3-small` for semantic similarity
- Server-side API key handling

## Architecture

```text
┌───────────────────────────────┐
│          React Client         │
│ Pages • Components • Router   │
└───────────────┬───────────────┘
                │ REST / JSON
                ▼
┌───────────────────────────────┐
│       Express REST API        │
│ Auth • Validation • Services  │
│ Admin • AI • Error Handling   │
└───────┬───────────────┬───────┘
        │               │
        ▼               ▼
┌──────────────┐  ┌────────────────┐
│    MySQL     │  │   OpenAI API   │
│ Users        │  │ Advisor        │
│ Dilemmas     │  │ Analyzer       │
│ Experiences  │  │ Embeddings     │
│ Contributors │  └────────────────┘
└──────────────┘
```

## Authentication and authorization

```text
Register / Login
      ↓
JWT issued
      ↓
Client stores access token
      ↓
Protected API request
      ↓
requireAuth
      ↓
User loaded from DB
      ↓
Optional requireAdmin
```

The server requires `JWT_SECRET`; there is no predictable fallback secret. Login attempts are rate-limited, and AI routes require authentication plus rate limiting.

## Experience moderation flow

```text
Authenticated student
        ↓
POST /api/experiences/submit
        ↓
Validate fields + dilemma + decision
        ↓
BEGIN TRANSACTION
        ↓
Upsert contributor + create experience
        ↓
PENDING
        ↓
Admin dashboard
   ↙           ↘
APPROVE       REJECT
   ↓             ↓
PUBLISHED     REJECTED
   ↓
Public Pathfinder library
```

The contributor update and experience creation use the same database transaction so a failure rolls both operations back.

## AI architecture

### 1. AI Dilemma Advisor

The backend loads the selected dilemma and published experiences, sends relevant context to the model, and returns structured decision support. The AI is instructed to use Pathfinder experiences as evidence rather than promise a guaranteed career outcome.

### 2. AI Experience Analyzer

A student's draft is sent to the backend for structured feedback:

```text
Draft → AI analysis → strengths / gaps / suggestions / improved lesson
```

The prompt explicitly prevents invented achievements, numbers, companies, or outcomes.

### 3. Similar Experiences

```text
Target experience
      ↓
Embedding vector
      ↓
Compare with published experiences
      ↓
Cosine similarity
      ↓
Top 3 similar experiences
```

This is an MVP-friendly approach. At larger scale, embeddings should be generated when an experience is published and stored for vector search rather than recalculated for every request.

## REST API

A lightweight machine-readable endpoint list is available at:

`GET /api/docs`

### Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/dilemmas` | List published dilemmas |
| GET | `/api/dilemmas/:slug` | Dilemma detail |
| GET | `/api/experiences` | Published experiences |
| GET | `/api/experiences/:id` | Experience detail |
| GET | `/api/contributors` | Contributors |
| GET | `/api/contributors/:id` | Contributor detail |

### Authenticated

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/auth/me` | Current user |
| POST | `/api/experiences/submit` | Submit experience |
| POST | `/api/ai/advisor` | AI dilemma advice |
| POST | `/api/ai/analyze-experience` | Analyze draft |
| GET | `/api/ai/similar/:id` | Similar experiences |

### Admin

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/experiences/pending` | Pending queue |
| PATCH | `/api/admin/experiences/:id/approve` | Publish experience |
| PATCH | `/api/admin/experiences/:id/reject` | Reject experience |

## Database model

Main entities:

```text
users
  │
  ├── contributors
  │       │
  │       └── experiences ─── dilemmas
  │
  └── reviewed experiences (admin)
```

Foreign keys and indexed lookup fields support the main experience, contributor, dilemma, and moderation queries.

## Validation and testing

The backend uses Node's built-in test runner. Run:

```bash
cd server
npm install
npm test
```

The test suite covers experience validation, authentication validation, moderation-note validation, admin authorization, and API error behavior.

## Local setup

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env` from `.env.example` and provide your own database credentials, JWT secret, admin credentials, and OpenAI API key if AI features are required.

```bash
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Optional frontend environment variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Environment variables

Never commit `.env` or real secrets. Use `.env.example` only as a template.

Required server configuration includes:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=pathfinder
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@pathfinder.local
ADMIN_PASSWORD=your_admin_password
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.6-luna
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

## Project structure

```text
pathfinder/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── styles/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── test/
└── README.md
```

## Engineering decisions

- **MySQL:** relational data fits dilemmas, users, contributors, experiences, and moderation relationships.
- **JWT:** simple stateless authentication for the MVP; production hardening can move access tokens to secure HttpOnly SameSite cookies.
- **Server-side AI calls:** protects the OpenAI API key from the browser.
- **Curated dilemmas:** prevents duplicate near-identical topics and keeps the platform's taxonomy intentional.
- **Moderation:** keeps user-generated content out of the public library until reviewed.
- **Transactions:** keeps contributor and experience writes consistent.
- **Rate limiting:** reduces brute-force attempts and uncontrolled AI usage.

## Phase 7 — Production readiness

Pathfinder now includes several production-oriented foundations:

- HttpOnly `pathfinder_session` cookie authentication with SameSite protection; Bearer JWTs remain supported for API clients.
- Structured request timing logs for operational visibility.
- OpenAPI 3.0 endpoint document at `/api/openapi.json`.
- Idempotent database migration for embedding/index changes.
- API smoke/integration tests that run automatically when server dependencies are installed.
- CI continues to run backend tests and the frontend production build.

Do not commit `.env` or production secrets.

## Future improvements

- Automated integration tests with a dedicated test database
- Persisted embeddings and vector search at scale
- Distributed rate limiting for multiple backend instances
- Better observability and structured request logging
- Secure HttpOnly cookie authentication
- CI pipeline for linting, tests, and production builds

## Recruiter summary

Pathfinder demonstrates full-stack development beyond CRUD screens: authentication, RBAC, relational data modeling, moderation workflows, transactional writes, REST APIs, rate limiting, and practical AI integration.

## Phase 6 — Production-readiness improvements

- Replaced dilemma and contributor list N+1 tag/count queries with aggregated SQL queries.
- Made dilemma search/count filters consistent, including tag-aware search.
- Added exact SQL decision distributions for dilemma detail pages.
- Added persisted experience embeddings through `embedding_json`; Similar Experiences reuses cached vectors and only generates embeddings for missing records.
- Added runtime validation for structured AI advisor/analyzer output before returning it to the client.
- Added a GitHub Actions CI workflow for backend tests and frontend production builds.
- Added `server/src/database/migrations/001_add_experience_embeddings.sql` for existing databases.

### Production scaling notes

The similarity implementation now has a persistent embedding cache, which removes repeated embedding API calls after an experience has been embedded. A later scale-up can move vector search to a dedicated vector database or MySQL vector capability and generate embeddings asynchronously when moderation publishes an experience.

The current rate limiters are intentionally dependency-free and process-local. A multi-instance deployment should replace them with a shared store such as Redis.
