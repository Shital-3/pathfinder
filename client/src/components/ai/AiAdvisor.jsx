import { useState } from "react";
import { aiApi } from "../../services/api";
import "./AiFeatures.css";

export default function AiAdvisor({ dilemmaSlug }) {
  const [question, setQuestion] = useState("");
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask() {
    if (!question.trim()) return;
    setLoading(true); setError("");
    try {
      setResult(await aiApi.advisor({ dilemmaSlug, question, profile }));
    } catch (err) {
      setError(err.message || "Unable to reach Pathfinder AI.");
    } finally { setLoading(false); }
  }

  return (
    <section className="pf-ai pf-ai--advisor">
      <div className="pf-ai__eyebrow">PATHFINDER AI</div>
      <h2>Think through this dilemma with AI.</h2>
      <p className="pf-ai__intro">Get a practical view grounded in published Pathfinder experiences — not a generic prescription.</p>
      <div className="pf-ai__form">
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Tell Pathfinder what you are deciding..." rows={4} />
        <input value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="Optional: your year, goals, timeline, current skills..." />
        <button type="button" className="btn btn--primary" onClick={ask} disabled={loading || !question.trim()}>
          {loading ? "Thinking..." : "Ask Pathfinder AI"}
        </button>
      </div>
      {error && <p className="pf-ai__error">{error}</p>}
      {result && (
        <div className="pf-ai__result">
          <div className="pf-ai__result-block"><span>RECOMMENDATION</span><p>{result.recommendation}</p></div>
          {result.reasons?.length > 0 && <div className="pf-ai__result-block"><span>WHY</span><ul>{result.reasons.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          {result.actionPlan?.length > 0 && <div className="pf-ai__result-block"><span>NEXT STEPS</span><ol>{result.actionPlan.map((item) => <li key={item}>{item}</li>)}</ol></div>}
          {result.evidence?.length > 0 && <div className="pf-ai__result-block"><span>PATHFINDER EVIDENCE</span><ul>{result.evidence.map((item) => <li key={item.id}>{item.takeaway}</li>)}</ul></div>}
        </div>
      )}
    </section>
  );
}
