# Pathfinder — Understand Your Options Before You Decide

> A full-stack student decision-support platform that helps students make better academic and career decisions using real student experiences, structured trade-offs, and AI-assisted insights.

**Live Demo:** [pathfinder-murex-seven.vercel.app](https://pathfinder-murex-seven.vercel.app/)
**Backend API:** [pathfinder-production-cf47.up.railway.app](https://pathfinder-production-cf47.up.railway.app)
**GitHub:** [github.com/Shital-3/pathfinder](https://github.com/Shital-3/pathfinder)

---

## Overview

Students often face important decisions such as:

- DSA vs Projects
- Java vs Python
- Internship vs Academics
- MERN vs Java Full Stack
- Job vs Higher Studies
- Startup vs Service Company

Most advice available online is generic and doesn't provide enough context about what actually happened after someone made a particular choice.

**Pathfinder converts real student experiences into structured decision-support information.**

Students can explore dilemmas, compare community choices, understand trade-offs, read published experiences, and use AI-assisted guidance grounded in Pathfinder's experience data.

---

## Why Pathfinder?

Pathfinder is designed around a simple pipeline:

```
Decision
   ↓
Real Student Experiences
   ↓
Trade-offs & Outcomes
   ↓
Context
   ↓
Better-informed Decision
```

Instead of generic advice, every dilemma on Pathfinder is backed by real outcomes shared by students who've actually lived through that choice.

---

## Features

- **Dilemma Directory** — browse common academic/career dilemmas students face
- **Community Insights** — see how other students weighed similar trade-offs
- **Experience Sharing** — students can publish their own decision journeys and outcomes
- **Contributor Profiles** — attribution for students who share experiences
- **Resource Section** — curated resources relevant to each dilemma
- **Filters** — narrow dilemmas/experiences by category
- **Secure Auth** — JWT-based authentication with password hashing
- **AI-assisted structuring** *(planned)* — LLM-assisted formatting of submitted experiences with a human-in-the-loop preview before publishing

---

## Tech Stack

**Frontend**
- React + Vite
- React Router (`react-router-dom`)

**Backend**
- Node.js + Express 5
- MySQL (via `mysql2` connection pool)
- JWT (`jsonwebtoken`) for authentication
- `bcrypt` for password hashing
- `cors` for cross-origin request handling
- `dotenv` for environment configuration

**Deployment**
- Frontend hosted on **Vercel**
- Backend hosted on **Railway**

---

## Project Structure

```
pathfinder/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # organized by domain (dilemmas, experiences, contributors, faq, home, layout, shared)
│   │   └── pages/         # Home, DilemmaDirectory, DilemmaDetail, ExperiencesPage, ContributorsPage, AboutPage, ShareExperience, SignInPage
│   └── ...
├── server/          # Express backend
│   ├── src/
│   │   ├── config/        # db.js, cors.js
│   │   ├── database/      # seed.js
│   │   └── ...
│   └── server.js
└── README.md
```

---

## Database Schema

MySQL schema covers:

- `users`
- `dilemmas`
- `experiences`
- `resources`
- `votes`
- `badges`

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL database (local or hosted)

### Clone the repo

```bash
git clone https://github.com/Shital-3/pathfinder.git
cd pathfinder
```

### Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_jwt_secret
PORT=8080
```

Run the server:

```bash
npm start        # production
npm run dev      # development, with file watching
npm run seed      # seed the database
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` by default.

---

## Roadmap

- [ ] LLM-assisted structuring of submitted experiences with human review before publishing
- [ ] Improved Open Graph previews for shared dilemma/experience links
- [ ] Expanded contributor profiles
- [ ] Additional dilemma categories

---

## Contributing

This is currently a solo-built project, but feedback and suggestions are welcome via [Issues](https://github.com/Shital-3/pathfinder/issues).

---

## License

This project is currently unlicensed. All rights reserved by the author.
