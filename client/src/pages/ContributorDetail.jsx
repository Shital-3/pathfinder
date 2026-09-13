import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ExperienceCard from "../components/experiences/ExperienceCard";
import { apiRequest } from "../services/api";
import "./ContributorDetail.css";

function mapExperience(item) {
  return {
    ...item,
    contributor: {
      id: item.contributor_id,
      name: item.contributor_name || item.author_name,
      initials: item.initials || item.author_name?.slice(0, 2).toUpperCase(),
      role: item.role_title || item.author_role,
      verified: Boolean(item.verified),
      classYear: item.class_year ? `Class of ${item.class_year}` : "",
    },
  };
}

export default function ContributorDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/contributors/${id}`)
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err) => { if (!cancelled) setError(err.message || "Contributor not found"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="contributor-detail container"><p>Loading contributor...</p></div>;

  const contributor = data?.contributor;
  const experiences = (data?.experiences || []).map(mapExperience);

  if (error || !contributor) {
    return (
      <div className="contributor-detail container">
        <Link className="contributor-detail__back" to="/contributors">Back to contributors</Link>
        <div className="contributor-detail__not-found">
          <p className="contributor-detail__eyebrow">THE COMMUNITY</p>
          <h1>Contributor not found</h1>
          <p>{error || "This profile may have been removed or the link is incomplete."}</p>
          <Link className="btn btn--primary" to="/contributors">Browse contributors</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="contributor-detail">
      <div className="container">
        <div className="contributor-detail__breadcrumb">
          <Link to="/contributors">Contributors</Link>
          <span aria-hidden="true">/</span>
          <span>{contributor.name}</span>
        </div>

        <header className="contributor-detail__profile">
          <span className="contributor-detail__avatar">{contributor.initials}</span>
          <div className="contributor-detail__identity">
            <h1>
              {contributor.name}
              {contributor.verified && <span className="verified-badge" title="Background verified" aria-label="Background verified">✓</span>}
            </h1>
            <p className="contributor-detail__role">{contributor.role_title}</p>
            <p className="contributor-detail__bio">{contributor.bio}</p>
            <div className="contributor-detail__tags">
              {(contributor.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>

          <dl className="contributor-detail__facts">
            <div><dt>Class of</dt><dd>{contributor.class_year || "Not provided"}</dd></div>
            <div><dt>Background</dt><dd>{contributor.background || "Not provided"}</dd></div>
            <div><dt>Location</dt><dd>{contributor.location || "Not provided"}</dd></div>
          </dl>
        </header>

        <section className="contributor-detail__experiences">
          <p className="contributor-detail__count">Experiences shared · {experiences.length}</p>
          {experiences.length > 0 ? (
            <div className="contributor-detail__experience-grid">
              {experiences.map((experience) => <ExperienceCard key={experience.id} experience={experience} linkTo />)}
            </div>
          ) : (
            <p className="contributor-detail__empty">This contributor has not shared a published experience yet.</p>
          )}
        </section>
      </div>
    </article>
  );
}
