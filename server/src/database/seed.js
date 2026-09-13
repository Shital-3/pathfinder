import "dotenv/config";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import pool from "../config/db.js";

const adminEmail = process.env.ADMIN_EMAIL || "admin@pathfinder.local";
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminPassword) throw new Error("ADMIN_PASSWORD is required to seed the admin account.");

const categories = [
  { name: "Placement", slug: "placement" },
  { name: "Technology", slug: "technology" },
  { name: "Career", slug: "career" },
  { name: "Higher Studies", slug: "higher-studies" },
];

const dilemmas = [
  {
    slug: "dsa-vs-projects",
    category: "Placement",
    title: "Should I focus on DSA or Projects?",
    description: "The classic final-year dilemma - grind LeetCode for FAANG-style interviews or build projects that showcase real engineering.",
    context: "Every CS student hits this crossroads. The right sequence depends on the target role, timeline, and current fundamentals.",
    options: ["DSA", "Projects"],
    tags: ["Placement", "Interview", "Development"],
    tradeoffs: [
      ["Interview call rate (FAANG)", "High", "Med-Low"],
      ["Interview call rate (Startups)", "Med-Low", "High"],
      ["Portfolio depth", "Low", "High"],
      ["Practical engineering skill", "Low", "High"],
      ["Time to competence (months)", "6-8", "4-6"],
      ["Short-term ROI", "High", "Med-Low"],
      ["Long-term career leverage", "Med-Low", "High"],
    ],
  },
  {
    slug: "java-vs-python",
    category: "Technology",
    title: "Java or Python for placements?",
    description: "One is the interview darling of every service company. The other is the lingua franca of AI, backend, and scripting.",
    context: "The best choice depends on the role, the ecosystem you want to enter, and how deeply you are willing to learn the language.",
    options: ["Java", "Python"],
    tags: ["Language", "Placement", "Career"],
    tradeoffs: [["FAANG interview friendliness", "High", "Medium"], ["AI/ML ecosystem", "Low", "High"], ["Learning curve", "Steep", "Gentle"]],
  },
  {
    slug: "mern-vs-java-fullstack",
    category: "Technology",
    title: "MERN vs Java Full Stack",
    description: "Two common full-stack tracks in Indian engineering colleges. Different ecosystems, different hiring pools.",
    context: "Both tracks can lead to strong engineering careers when paired with fundamentals, deployed work, and consistent practice.",
    options: ["MERN", "Java Full Stack"],
    tags: ["Full Stack", "Placement", "Technology"],
    tradeoffs: [["Startup velocity", "High", "Medium"], ["Enterprise hiring", "Medium", "High"], ["Deployment learning curve", "Gentle", "Medium"]],
  },
  {
    slug: "internship-vs-academics",
    category: "Career",
    title: "Internship or Academics in final year?",
    description: "Skip attendance to intern at a real company, or protect your CGPA and campus placement eligibility?",
    context: "The decision depends on internship quality, conversion probability, academic requirements, and financial context.",
    options: ["Internship", "Academics"],
    tags: ["Internship", "Academics", "Final Year"],
    tradeoffs: [["Practical exposure", "High", "Low"], ["CGPA protection", "Medium", "High"], ["Early job signal", "High", "Medium"]],
  },
  {
    slug: "job-vs-higher-studies",
    category: "Higher Studies",
    title: "Job or Higher Studies after B.Tech?",
    description: "Take the offer, or spend two more years and significant savings on an MS abroad?",
    context: "A clear question and a realistic financial plan matter more than following a trend.",
    options: ["Job", "Higher Studies"],
    tags: ["Career", "Higher Studies", "Finance"],
    tradeoffs: [["Immediate income", "High", "Low"], ["Specialization depth", "Medium", "High"], ["Financial risk", "Low", "High"]],
  },
  {
    slug: "startup-vs-service-company",
    category: "Career",
    title: "Startup or Service Company as first job?",
    description: "A high-growth startup with equity, or a stable service company with structured training?",
    context: "Both paths can work. The useful comparison is ownership, learning pace, stability, compensation, and support.",
    options: ["Startup", "Service Company"],
    tags: ["Career", "Startup", "First Job"],
    tradeoffs: [["Ownership per week", "High", "Low"], ["Structured training", "Low", "High"], ["Work-life balance", "Low", "High"]],
  },
];

const contributors = [
  {
    name: "Rahul Verma", initials: "RV", role: "Full-stack Engineer at Razorpay", bio: "Chose projects over LeetCode grind. Now maintains open-source tools with 12k+ stars.", classYear: 2023, background: "B.E. Information Science, RVCE", location: "Bengaluru, India", verified: true, tags: ["Projects", "Open Source", "MERN"],
  },
  {
    name: "Aditi Sharma", initials: "AS", role: "SDE-1 at Atlassian", bio: "Started as a competitive programmer, transitioned into product engineering. Believes in learning by shipping.", classYear: 2024, background: "B.Tech CSE, IIIT Hyderabad", location: "Bengaluru, India", verified: true, tags: ["Placements", "DSA", "Interview Prep"],
  },
  {
    name: "Priya Menon", initials: "PM", role: "Product Analyst at Swiggy", bio: "Interned three times before final year. Learned more from failed internships than any classroom.", classYear: 2024, background: "B.Tech Information Technology", location: "Bengaluru, India", verified: true, tags: ["Internships", "Product", "Career Switch"],
  },
  {
    name: "Neha Iyer", initials: "NI", role: "MS CS candidate, Georgia Tech", bio: "Turned down a 22 LPA offer for grad school. Sharing the honest math behind higher studies.", classYear: 2025, background: "B.Tech Computer Science", location: "Atlanta, United States", verified: true, tags: ["Higher Studies", "GRE", "Applications"],
  },
  {
    name: "Karthik Reddy", initials: "KR", role: "Backend Engineer at Zerodha", bio: "Bet on Java + Spring while everyone chased MERN. Here is what worked.", classYear: 2023, background: "B.E. Computer Science", location: "Hyderabad, India", verified: true, tags: ["Java Full Stack", "Backend", "Placements"],
  },
  {
    name: "Arjun Patel", initials: "AP", role: "ML Engineer at Fractal", bio: "Learned Python in second year, wrote papers in third, landed ML role in fourth.", classYear: 2024, background: "B.Tech Mathematics and Computing", location: "Mumbai, India", verified: false, tags: ["Python", "Machine Learning", "Research"],
  },
];

const experiences = [
  {
    choice: "Startup", contributor: "Priya Menon", dilemma: "startup-vs-service-company", quote: "If you want speed, choose the smaller pond. You'll swim faster.", body: "Promoted to Product Analyst after 10 months. My service-company friends were still in training.", background: "Placed at both TCS Digital and Swiggy. Chose Swiggy.", context: "Everyone around me picked the service company for stability. I felt I would learn slower there.", whyChoice: "I wanted product exposure fast. Swiggy was 6000 people - startup energy with adult processes.", whatDid: "Joined Swiggy full-time, chose the analytics track, learned SQL and product thinking in year 1.", whatWorked: "Ownership. Week one I had a dashboard being reviewed by a VP.", whatDidNot: "Long hours. Weekend pings. It is real. Know what you are signing up for.", whatWouldDoDifferently: "Nothing major - I would make the same call again.", outcome: "Promoted to Product Analyst after 10 months. My service-company friends were still in training.", lesson: "If you want speed, choose the smaller pond. You will swim faster.",
  },
  {
    choice: "Higher Studies", contributor: "Neha Iyer", dilemma: "job-vs-higher-studies", quote: "Higher studies is a great answer to a specific question. Make sure you know the question.", body: "Currently in my 2nd semester. Landed an SDE internship at a US company for summer.", background: "Worked as a software engineer for two years before applying to graduate school.", context: "I wanted deeper systems knowledge, but I needed a clear reason to pause a growing career.", whyChoice: "A focused degree gave me access to research, mentors, and a stronger technical network.", whatDid: "Compared programs, spoke with current students, and built a financial plan before accepting an offer.", whatWorked: "Choosing a program for its courses and community instead of its ranking alone.", whatDidNot: "The workload is intense and the financial trade-off takes longer than expected.", whatWouldDoDifferently: "I would start networking with alumni several months earlier.", outcome: "Currently in my 2nd semester and landed an SDE internship at a US company for summer.", lesson: "Higher studies is a great answer to a specific question. Make sure you know the question.",
  },
  {
    choice: "Internship", contributor: "Priya Menon", dilemma: "internship-vs-academics", quote: "A high-quality internship in final year is almost always worth the CGPA dip.", body: "PPO converted. Started full-time 3 months before batchmates.", background: "Had to choose between a demanding internship and protecting a strong final-year CGPA.", context: "The internship offered real ownership, but it overlapped with the most exam-heavy semester.", whyChoice: "The chance to work with a real product team felt more valuable than a small grade improvement.", whatDid: "Set clear expectations with professors and reserved fixed evenings for coursework.", whatWorked: "Treating the internship like a course with weekly goals and deliberate reflection.", whatDidNot: "The first month was a difficult reset from classroom pace to production pace.", whatWouldDoDifferently: "I would clarify the conversion criteria before joining.", outcome: "PPO converted. Started full-time three months before batchmates.", lesson: "A high-quality internship in final year is almost always worth the CGPA dip.",
  },
  {
    choice: "MERN", contributor: "Rahul Verma", dilemma: "mern-vs-java-fullstack", quote: "MERN rewards velocity. If you love shipping, this stack pays for itself.", body: "Razorpay hired me primarily on my open-source and freelance track record.", background: "Started with small freelance sites, then built full products with MongoDB, Express, React, and Node.", context: "I needed a stack that let me validate ideas quickly without waiting on a large team.", whyChoice: "The feedback loop was short enough to keep learning tied to things users could actually use.", whatDid: "Published projects, contributed fixes to open source, and wrote about the decisions behind each build.", whatWorked: "Shipping often and making every project easy for another engineer to run locally.", whatDidNot: "Moving fast sometimes left gaps in testing and performance work.", whatWouldDoDifferently: "I would learn deployment and observability earlier.", outcome: "Razorpay hired me primarily on my open-source and freelance track record.", lesson: "MERN rewards velocity. If you love shipping, this stack pays for itself.",
  },
  {
    choice: "Python", contributor: "Arjun Patel", dilemma: "java-vs-python", quote: "Match the language to the world you want to enter. Python is the passport to ML/data.", body: "Fractal offer, then a research internship at IIT Bombay's ML lab.", background: "Moved from general software projects into statistics, experimentation, and machine learning.", context: "I was choosing between a familiar language and the ecosystem closest to the work I wanted.", whyChoice: "Most of the data and ML tooling I wanted to learn was already strongest in Python.", whatDid: "Worked through fundamentals, reproduced papers, and joined a research lab to build discipline.", whatWorked: "Pairing language practice with math and domain knowledge instead of collecting tutorials.", whatDidNot: "The ecosystem is broad enough to make direction hard without a concrete project.", whatWouldDoDifferently: "I would publish earlier and ask for feedback before polishing projects.", outcome: "Received a Fractal offer, then a research internship at IIT Bombay's ML lab.", lesson: "Match the language to the world you want to enter.",
  },
  {
    choice: "Java", contributor: "Karthik Reddy", dilemma: "java-vs-python", quote: "The boring language is boring only until you go deep. Depth is rare, and rare gets hired.", body: "Zerodha reached out after seeing my broker project. Three rounds, one offer.", background: "Learned Java through backend services and a market-data project rather than isolated exercises.", context: "Friends were moving to newer stacks, but I enjoyed understanding how reliable systems behave under load.", whyChoice: "Java gave me a deep platform, mature tooling, and a clear path into backend engineering.", whatDid: "Built a broker simulator, profiled it, and documented the trade-offs in a public repository.", whatWorked: "Going deep on concurrency, testing, and the JVM instead of chasing every new framework.", whatDidNot: "The first few months felt slower because the fundamentals were demanding.", whatWouldDoDifferently: "I would spend more time learning databases alongside the language.", outcome: "Zerodha reached out after seeing my broker project. Three rounds, one offer.", lesson: "Depth is rare, and rare gets hired.",
  },
  {
    choice: "Projects", contributor: "Rahul Verma", dilemma: "dsa-vs-projects", quote: "Projects don't replace DSA, but they change which doors open. Different doors, different offers.", body: "Got interviews at Razorpay, Groww, and CRED without applying - via GitHub and blog. Joined Razorpay.", background: "Focused on a small set of products instead of a large collection of unfinished tutorials.", context: "I wanted proof that I could make engineering decisions, not just pass a timed coding screen.", whyChoice: "A shipped project creates conversations about users, constraints, and trade-offs.", whatDid: "Built useful products, wrote technical notes, and kept the code and demos easy to inspect.", whatWorked: "Showing the reasoning behind the work and being honest about what was incomplete.", whatDidNot: "Projects alone did not prepare me for every algorithmic interview.", whatWouldDoDifferently: "I would schedule DSA practice alongside project work from the beginning.", outcome: "Got interviews at Razorpay, Groww, and CRED without applying. Joined Razorpay.", lesson: "Projects change which doors open. Different doors, different offers.",
  },
  {
    choice: "DSA", contributor: "Aditi Sharma", dilemma: "dsa-vs-projects", quote: "For FAANG-style hiring, DSA is a filter, not a differentiator. Clear the filter fast, then invest elsewhere.", body: "Cleared Atlassian, Microsoft, and Uber onsites. Accepted Atlassian's offer.", background: "Prepared for product-company interviews while building enough practical work to discuss in depth.", context: "I needed DSA to clear the first gate, but I did not want preparation to become my entire identity.", whyChoice: "Strong fundamentals made the interview process predictable enough to focus on communication.", whatDid: "Grouped problems by pattern, reviewed mistakes weekly, and practiced explaining solutions aloud.", whatWorked: "A time-boxed routine and deliberate review instead of endlessly solving new questions.", whatDidNot: "The preparation can crowd out sleep and product thinking if left unbounded.", whatWouldDoDifferently: "I would start mock interviews earlier and stop grinding once the goal was met.", outcome: "Cleared Atlassian, Microsoft, and Uber onsites. Accepted Atlassian's offer.", lesson: "For FAANG-style hiring, DSA is a filter, not a differentiator.",
  },
];

async function insertSeedData(connection) {
  const categoryIds = new Map();
  const tagIds = new Map();
  const dilemmaIds = new Map();
  const contributorIds = new Map();

  const adminId = randomUUID();
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await connection.execute(
    "INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, 'ADMIN')",
    [adminId, adminEmail.toLowerCase(), passwordHash, "Pathfinder Admin"]
  );

  for (const category of categories) {
    const id = randomUUID();
    categoryIds.set(category.name, id);
    await connection.execute(
      "INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)",
      [id, category.name, category.slug]
    );
  }

  const allTags = new Set([
    ...dilemmas.flatMap((dilemma) => dilemma.tags),
    ...contributors.flatMap((contributor) => contributor.tags),
  ]);

  for (const tag of allTags) {
    const id = randomUUID();
    tagIds.set(tag.toLowerCase(), id);
    await connection.execute(
      "INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)",
      [id, tag, tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")]
    );
  }

  for (const dilemma of dilemmas) {
    const id = randomUUID();
    dilemmaIds.set(dilemma.slug, id);
    await connection.execute(
      "INSERT INTO dilemmas (id, slug, category_id, title, description, context) VALUES (?, ?, ?, ?, ?, ?)",
      [id, dilemma.slug, categoryIds.get(dilemma.category), dilemma.title, dilemma.description, dilemma.context]
    );

    for (const [displayOrder, label] of dilemma.options.entries()) {
      await connection.execute(
        "INSERT INTO dilemma_options (id, dilemma_id, label, display_order) VALUES (?, ?, ?, ?)",
        [randomUUID(), id, label, displayOrder]
      );
    }

    for (const tag of dilemma.tags) {
      await connection.execute(
        "INSERT INTO dilemma_tags (dilemma_id, tag_id) VALUES (?, ?)",
        [id, tagIds.get(tag.toLowerCase())]
      );
    }

    for (const [displayOrder, [metric, leftValue, rightValue]] of dilemma.tradeoffs.entries()) {
      await connection.execute(
        "INSERT INTO dilemma_tradeoffs (id, dilemma_id, metric, left_value, right_value, display_order) VALUES (?, ?, ?, ?, ?, ?)",
        [randomUUID(), id, metric, leftValue, rightValue, displayOrder]
      );
    }
  }

  for (const contributor of contributors) {
    const id = randomUUID();
    contributorIds.set(contributor.name, id);
    await connection.execute(
      "INSERT INTO contributors (id, name, initials, role_title, bio, class_year, background, location, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, contributor.name, contributor.initials, contributor.role, contributor.bio, contributor.classYear, contributor.background, contributor.location, contributor.verified]
    );

    for (const tag of contributor.tags) {
      await connection.execute(
        "INSERT INTO contributor_tags (contributor_id, tag_id) VALUES (?, ?)",
        [id, tagIds.get(tag.toLowerCase())]
      );
    }
  }

  for (const experience of experiences) {
    const contributor = contributors.find((item) => item.name === experience.contributor);
    await connection.execute(
      `INSERT INTO experiences (
        id, contributor_id, dilemma_id, author_name, author_role, graduation_year,
        decision, quote, body, background, context, why_choice, what_did,
        what_worked, what_did_not, what_would_do_differently, outcome, lesson, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')`,
      [
        randomUUID(), contributorIds.get(experience.contributor), dilemmaIds.get(experience.dilemma),
        contributor.name, contributor.role, contributor.classYear, experience.choice,
        experience.quote, experience.body, experience.background, experience.context,
        experience.whyChoice, experience.whatDid, experience.whatWorked,
        experience.whatDidNot, experience.whatWouldDoDifferently, experience.outcome,
        experience.lesson,
      ]
    );
  }
}

async function clearSeedTables(connection) {
  await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
  for (const table of ["experiences", "dilemma_tradeoffs", "contributor_tags", "dilemma_tags", "dilemma_options", "contributors", "dilemmas", "tags", "categories", "users"]) {
    await connection.execute(`DELETE FROM ${table}`);
  }
  await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
}

async function hasExistingData(connection) {
  const [[userRow]] = await connection.query("SELECT COUNT(*) AS count FROM users");
  const [[experienceRow]] = await connection.query("SELECT COUNT(*) AS count FROM experiences");
  const [[contributorRow]] = await connection.query("SELECT COUNT(*) AS count FROM contributors");
  return userRow.count > 0 || experienceRow.count > 0 || contributorRow.count > 0;
}

async function seed() {
  const force = process.argv.includes("--force");
  let connection;

  try {
    connection = await pool.getConnection();

    if (!force && (await hasExistingData(connection))) {
      console.error(
        "Seed aborted: the database already has users, experiences, or contributors in it.\n" +
        "Running seed again would DELETE all of that real data and replace it with sample data.\n" +
        "If you're sure you want to wipe everything and reset to the sample dataset, run:\n" +
        "  npm run seed -- --force"
      );
      process.exitCode = 1;
      return;
    }

    await connection.beginTransaction();
    await clearSeedTables(connection);
    await insertSeedData(connection);
    await connection.commit();
    console.log(`Seed complete. Admin login: ${adminEmail}`);
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    connection?.release();
    await pool.end();
  }
}

seed();