// TODO: replace with GET /api/dilemmas once the Discovery Directory backend route is live
export const DILEMMAS = [
  {
    slug: "dsa-vs-projects",
    category: "Placement",
    experienceCount: 124,
    title: "Should I focus on DSA or Projects?",
    description: "The classic final-year dilemma — grind LeetCode for FAANG-style interviews or build projects that showcase real engineering.",
    left: { label: "DSA", percent: 68 },
    right: { label: "Projects", percent: 32 },
    tags: ["Placement", "Interview", "Development"],
  },
  {
    slug: "java-vs-python",
    category: "Technology",
    experienceCount: 96,
    title: "Java or Python for placements?",
    description: "One is the interview darling of every service company. The other is the lingua franca of AI, backend, and scripting.",
    left: { label: "Java", percent: 54 },
    right: { label: "Python", percent: 46 },
    tags: ["Language", "Placement", "Career"],
  },
  {
    slug: "mern-vs-java-fullstack",
    category: "Technology",
    experienceCount: 78,
    title: "MERN vs Java Full Stack",
    description: "Two of the most common full-stack tracks in Indian engineering colleges. Different ecosystems, different hiring pools.",
    left: { label: "MERN", percent: 61 },
    right: { label: "Java Full Stack", percent: 39 },
    tags: ["Full Stack", "Placement", "Technology"],
  },
  {
    slug: "internship-vs-academics",
    category: "Career",
    experienceCount: 64,
    title: "Internship or Academics in final year?",
    description: "Skip attendance to intern at a real company, or protect your CGPA and campus placement eligibility?",
    left: { label: "Internship", percent: 71 },
    right: { label: "Academics", percent: 29 },
    tags: ["Internship", "Academics", "Final Year"],
  },
  {
    slug: "job-vs-higher-studies",
    category: "Higher Studies",
    experienceCount: 52,
    title: "Job or Higher Studies after B.Tech?",
    description: "Take the offer, or spend two more years and ₹40–80 lakhs on an MS abroad?",
    left: { label: "Job", percent: 58 },
    right: { label: "Higher Studies", percent: 42 },
    tags: ["Career", "Higher Studies", "Finance"],
  },
  {
    slug: "startup-vs-service-company",
    category: "Career",
    experienceCount: 43,
    title: "Startup or Service Company as first job?",
    description: "A high-growth startup with equity, or a stable service company with structured training?",
    left: { label: "Startup", percent: 49 },
    right: { label: "Service Company", percent: 51 },
    tags: ["Career", "Startup", "First Job"],
  },
];

export const CATEGORIES = ["All", ...new Set(DILEMMAS.map((d) => d.category))];

export const PLANNED_CATEGORIES = ["Internship", "DSA"];