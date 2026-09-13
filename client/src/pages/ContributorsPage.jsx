import { useEffect, useState } from "react";
import ContributorCard from "../components/contributors/ContributorCard";
import EmptyState from "../components/shared/EmptyState";
import { apiRequest } from "../services/api";
import "./ContributorsPage.css";
import localContextStudents from "../assets/context-students.jpg";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80";

export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/contributors?limit=50")
      .then((data) => {
        if (!cancelled) setContributors(data.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Unable to load contributors.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="contrib-page">
      <div className="container contrib-page__hero">
        <div className="contrib-page__header">
          <span className="eyebrow">THE COMMUNITY</span>
          <h1 className="contrib-page__heading">Contributors</h1>
          <p className="contrib-page__subtext">
            Students, recent grads, and early-career professionals who've been
            through the decisions you're facing.
          </p>
        </div>
        <div className="contrib-page__image-wrap">
          <img src={localContextStudents || FALLBACK_IMAGE} onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} alt="Students talking together on campus" loading="lazy" />
        </div>
      </div>

      <div className="container contrib-page__grid">
        {loading && <p>Loading contributors...</p>}
        {!loading && error && <EmptyState title="Could not load contributors." body={error} />}
        {!loading && !error && contributors.length === 0 && <EmptyState title="No contributors yet." body="Share an experience to become the first contributor." />}
        {!loading && !error && contributors.map((contributor) => (
          <ContributorCard key={contributor.id} contributor={{
            ...contributor,
            role: contributor.role_title,
            classYear: contributor.class_year ? `Class of ${contributor.class_year}` : "",
            experienceCount: Number(contributor.experience_count || 0),
            tags: contributor.tags || [],
          }} linkTo />
        ))}
      </div>
    </div>
  );
}
