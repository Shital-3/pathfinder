import { useEffect, useState } from "react";
import ExperienceCard from "../components/experiences/ExperienceCard";
import EmptyState from "../components/shared/EmptyState";
import { apiRequest } from "../services/api";
import "./ExperiencesPage.css";

function mapExperience(item) {
  return {
    ...item,
    choice: item.choice,
    quote: item.quote || item.lesson,
    body: item.body || item.outcome,
    contributor: {
      id: item.contributor_id,
      name: item.contributor_name || item.author_name || "Anonymous contributor",
      initials: item.initials || (item.contributor_name || "A").slice(0, 2).toUpperCase(),
      role: item.role_title || "Student contributor",
      verified: Boolean(item.verified),
      classYear: item.class_year ? `Class of ${item.class_year}` : "",
    },
  };
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/experiences?limit=50")
      .then((data) => {
        if (!cancelled) setExperiences((data.items || []).map(mapExperience));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Unable to load experiences.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="exp-page">
      <section className="exp-page__hero-section">
        <div className="container exp-page__hero">
          <div className="exp-page__hero-content">
            <span className="eyebrow">THE LIBRARY</span>
            <h1 className="exp-page__heading">Experiences</h1>
            <p className="exp-page__subtext">
              Every experience is a structured, first-person account from a student who faced
              a real decision. No hot takes. No prescriptions.
            </p>
          </div>
          <div className="exp-page__hero-media">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
              alt="Minimal study workspace with laptop and notebook"
              className="exp-page__hero-img"
            />
          </div>
        </div>
      </section>

      <section className="exp-page__content-section">
        <div className="container exp-page__grid">
          {loading && <p>Loading experiences...</p>}
          {!loading && error && <EmptyState title="Could not load experiences." body={error} />}
          {!loading && !error && experiences.length === 0 && (
            <EmptyState title="No published experiences yet." body="Be the first student to share a real decision." />
          )}
          {!loading && !error && experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} linkTo />
          ))}
        </div>
      </section>
    </section>
  );
}
