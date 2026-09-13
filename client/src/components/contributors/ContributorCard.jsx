import "./ContributorCard.css";
import { Link } from "react-router-dom";

export default function ContributorCard({ contributor, linkTo = false }) {
  const Card = linkTo ? Link : "article";
  const cardProps = linkTo ? { to: `/contributors/${contributor.id}` } : {};

  return (
    <Card className="contrib-card" {...cardProps}>
      <div className="contrib-card__top">
        <span className="contrib-card__avatar">{contributor.initials}</span>
        <span className="contrib-card__arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <h3 className="contrib-card__name">
        {contributor.name}
        {contributor.verified && (
          <span
            className="verified-badge"
            title="Background verified"
            aria-label="Background verified"
          >
            ✓
          </span>
        )}
      </h3>
      
      <p className="contrib-card__role">{contributor.role}</p>
      <p className="contrib-card__bio">{contributor.bio}</p>

      <div className="contrib-card__tags">
        {contributor.tags.map((t) => (
          <span key={t} className="tag-box">
            {t}
          </span>
        ))}
      </div>

      <div className="contrib-card__footer">
        <span>
          {contributor.experienceCount} experience
          {contributor.experienceCount !== 1 ? "s" : ""}
        </span>
        <span>{contributor.classYear}</span>
      </div>
    </Card>
  );
}