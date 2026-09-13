import "./ExperienceCard.css";
import { Link } from "react-router-dom";

/**
 * experience: {
 *   choice, quote, body,
 *   contributor: { name, initials, role, verified }
 * }
 */
export default function ExperienceCard({ experience, linkTo = false }) {
  const Card = linkTo ? Link : "article";
  const cardProps = linkTo ? { to: `/experiences/${experience.id}` } : {};

  return (
    <Card className="exp-card" {...cardProps}>
      <div className="exp-card__top">
        <span className="exp-card__choice">Chose · {experience.choice}</span>
        <span className="exp-card__arrow" aria-hidden="true">↗</span>
      </div>

      <h3 className="exp-card__quote">{experience.quote}</h3>
      <p className="exp-card__body">{experience.body}</p>

      <div className="exp-card__attr">
        <span className="exp-card__avatar">{experience.contributor.initials}</span>
        <div className="exp-card__contributor">
          <span className="exp-card__name">
            {experience.contributor.name}
            {experience.contributor.verified && (
              <span className="verified-badge" title="Background verified" aria-label="Background verified">✓</span>
            )}
          </span>
          <span className="exp-card__role">{experience.contributor.role}</span>
        </div>
      </div>
    </Card>
  );
}