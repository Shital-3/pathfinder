import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./ExperienceDetail.css";
import SimilarExperiences from "../components/ai/SimilarExperiences";

export default function ExperienceDetail() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/experiences/${id}`)
      .then((item) => { if (!cancelled) setExperience(item); })
      .catch((err) => { if (!cancelled) setError(err.message || "Experience not found"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="experience-detail container"><p>Loading experience...</p></div>;

  if (error || !experience) {
    return (
      <div className="experience-detail container">
        <Link className="experience-detail__back" to="/experiences">Back to experiences</Link>
        <div className="experience-detail__not-found">
          <p className="experience-detail__eyebrow">THE LIBRARY</p>
          <h1>Experience not found</h1>
          <p>{error || "This account may have been removed or the link is incomplete."}</p>
          <Link className="btn btn--primary" to="/experiences">Browse experiences</Link>
        </div>
      </div>
    );
  }

  const contributor = {
    id: experience.contributor_id,
    name: experience.contributor_name || experience.author_name,
    initials: experience.initials || experience.author_name?.slice(0, 2).toUpperCase(),
    role: experience.role_title || experience.author_role,
    verified: Boolean(experience.verified),
    classYear: experience.class_year ? `Class of ${experience.class_year}` : "",
  };

  const details = [
    ["Background", experience.background],
    ["Context", experience.context],
    [`Why they chose ${experience.choice}`, experience.why_choice],
    ["What they did", experience.what_did],
    ["Outcome", experience.outcome],
    ["What worked", experience.what_worked],
    ["What did not", experience.what_did_not],
    ["What they would do differently", experience.what_would_do_differently],
  ];

  return (
    <article className="experience-detail">
      <div className="container">
        <div className="experience-detail__breadcrumb">
          <Link to="/experiences">Experiences</Link>
          <span aria-hidden="true">›</span>
          <Link to={`/dilemmas/${experience.dilemma_slug}`}>{experience.dilemma_title}</Link>
        </div>

        <header className="experience-detail__header">
          <p className="experience-detail__choice">Chose · {experience.choice}</p>
          <h1>{experience.quote || experience.lesson}</h1>
        </header>

        <div className="experience-detail__layout">
          <aside className="experience-detail__contributor" aria-label="Contributor">
            <span className="experience-detail__avatar">{contributor.initials}</span>
            <strong>
              {contributor.name}
              {contributor.verified && <span className="verified-badge" title="Background verified" aria-label="Background verified">✓</span>}
            </strong>
            <span>{contributor.role}</span>
            <span>{contributor.classYear}</span>
            {contributor.id && (
              <Link className="experience-detail__dilemma" to={`/contributors/${contributor.id}`}>
                <span>Contributor</span>
                <strong>View profile</strong>
              </Link>
            )}
          </aside>

          <div className="experience-detail__story">
            {details.map(([title, text]) => (
              <section className="experience-detail__section" key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </section>
            ))}

            <section className="experience-detail__lesson">
              <p className="experience-detail__lesson-label">Key lesson</p>
              <blockquote>"{experience.lesson}"</blockquote>
            </section>

            <SimilarExperiences experienceId={experience.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
