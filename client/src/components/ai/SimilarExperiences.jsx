import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { aiApi } from "../../services/api";
import "./AiFeatures.css";

export default function SimilarExperiences({ experienceId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    aiApi.similar(experienceId)
      .then((data) => { if (!cancelled) setItems(data || []); })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [experienceId]);

  if (!loading && !items.length) return null;

  return (
    <section className="pf-ai pf-ai--similar">
      <div className="pf-ai__eyebrow">PATHFINDER AI</div>
      <h2>Similar experiences</h2>
      <p className="pf-ai__intro">These stories are ranked by semantic similarity to this experience.</p>
      {loading ? <p>Finding related experiences...</p> : <div className="pf-ai__similar-grid">
        {items.map((item) => (
          <Link to={`/experiences/${item.id}`} className="pf-ai__similar-card" key={item.id}>
            <span>Chose · {item.choice}</span>
            <h3>{item.quote}</h3>
            <p>{item.body}</p>
            <small>{item.contributor.name}</small>
          </Link>
        ))}
      </div>}
    </section>
  );
}
