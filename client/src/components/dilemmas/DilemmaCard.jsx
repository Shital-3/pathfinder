import DistributionBar from "./DistributionBar";
import "./DilemmaCard.css";

/**
 * dilemma: {
 *   slug, category, title, description, experienceCount,
 *   left: { label, percent }, right: { label, percent }, tags: []
 * }
 */
export default function DilemmaCard({ dilemma }) {
  const paddedCount = String(dilemma.experienceCount).padStart(3, "0");

  return (
    <article className="dilemma-card">
      <div className="dilemma-card__meta">
        <span className="dilemma-card__category">{dilemma.category}</span>
        <span className="dilemma-card__count">{paddedCount} experiences</span>
      </div>

      <h3 className="dilemma-card__title">{dilemma.title}</h3>
      <p className="dilemma-card__desc">{dilemma.description}</p>

      <DistributionBar left={dilemma.left} right={dilemma.right} />

      <div className="dilemma-card__footer">
        <div className="dilemma-card__tags">
          {dilemma.tags.map((t) => (
            <span key={t} className="tag-box">{t}</span>
          ))}
        </div>
        <a href={`/dilemmas/${dilemma.slug}`} className="dilemma-card__link">
          Explore <span className="dilemma-card__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}