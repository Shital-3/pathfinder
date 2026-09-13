import { useState } from "react";
import { aiApi } from "../../services/api";
import "./AiFeatures.css";

export default function ExperienceAnalyzer({ formData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true); setError("");
    try { setResult(await aiApi.analyzeExperience(formData)); }
    catch (err) { setError(err.message || "Unable to analyze your experience."); }
    finally { setLoading(false); }
  }

  return (
    <div className="pf-ai pf-ai--analyzer">
      <div className="pf-ai__eyebrow">PATHFINDER AI</div>
      <h3>Check your experience before submitting.</h3>
      <p className="pf-ai__intro">AI will point out missing context and clarity issues without inventing details.</p>
      <button type="button" className="btn btn--outline" onClick={analyze} disabled={loading}>{loading ? "Analyzing..." : "Analyze my experience"}</button>
      {error && <p className="pf-ai__error">{error}</p>}
      {result && <div className="pf-ai__result">
        {result.strengths?.length > 0 && <div className="pf-ai__result-block"><span>WHAT'S STRONG</span><ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {result.gaps?.length > 0 && <div className="pf-ai__result-block"><span>WHAT'S MISSING</span><ul>{result.gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {result.suggestions?.length > 0 && <div className="pf-ai__result-block"><span>SUGGESTIONS</span><ul>{result.suggestions.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        {result.improvedOutcome && <div className="pf-ai__result-block"><span>OUTCOME CLARITY</span><p>{result.improvedOutcome}</p></div>}
        {result.improvedLesson && <div className="pf-ai__result-block"><span>LESSON CLARITY</span><p>{result.improvedLesson}</p></div>}
      </div>}
    </div>
  );
}
