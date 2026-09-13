import { useCallback, useEffect, useState } from "react";
import { Check, Clock3, RefreshCw, X } from "lucide-react";
import { adminApi } from "../services/api";
import "./AdminDashboard.css";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [notes, setNotes] = useState({});
  const [actionError, setActionError] = useState("");

  const loadPending = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await adminApi.pending();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Unable to load pending experiences");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  async function moderate(id, action) {
    const label = action === "approve" ? "approve" : "reject";
    const note = notes[id]?.trim() || "";

    if (action === "reject" && !note) {
      setActionError("Add a short moderation note before rejecting an experience.");
      return;
    }

    setActionError("");
    setActionId(id);
    try {
      await adminApi[action](id, note);
      setItems((current) => current.filter((item) => item.id !== id));
      setNotes((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (err) {
      setActionError(`Could not ${label} this experience. ${err.message || "Please try again."}`);
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="admin-dashboard section">
      <div className="container">
        <header className="admin-dashboard__header">
          <div>
            <p className="eyebrow">ADMINISTRATION</p>
            <h1>Moderation dashboard</h1>
            <p className="admin-dashboard__intro">
              Review student experiences before they become part of Pathfinder's public library.
            </p>
          </div>
          <button
            type="button"
            className="btn btn--outline admin-dashboard__refresh"
            onClick={() => loadPending(true)}
            disabled={refreshing || loading}
          >
            <RefreshCw size={16} className={refreshing ? "admin-dashboard__spin" : ""} />
            Refresh
          </button>
        </header>

        <div className="admin-dashboard__summary">
          <div>
            <span className="admin-dashboard__summary-label">Pending review</span>
            <strong>{loading ? "—" : items.length}</strong>
          </div>
          <div className="admin-dashboard__summary-status">
            <Clock3 size={18} aria-hidden="true" />
            <span>Only PENDING experiences appear here.</span>
          </div>
        </div>

        {error && (
          <div className="admin-dashboard__message admin-dashboard__message--error" role="alert">
            {error}
            <button type="button" className="btn btn--sm btn--outline" onClick={() => loadPending()}>
              Try again
            </button>
          </div>
        )}

        {actionError && (
          <div className="admin-dashboard__message admin-dashboard__message--error" role="alert">
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="admin-dashboard__empty">Loading submissions...</div>
        ) : !error && items.length === 0 ? (
          <div className="admin-dashboard__empty">
            <Check size={28} aria-hidden="true" />
            <h2>All caught up</h2>
            <p>There are no student experiences waiting for moderation.</p>
          </div>
        ) : (
          <div className="admin-dashboard__list">
            {items.map((item) => (
              <article className="admin-review-card" key={item.id}>
                <div className="admin-review-card__topline">
                  <span className="admin-review-card__status">PENDING</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>

                <div className="admin-review-card__header">
                  <div>
                    <p className="admin-review-card__dilemma">{item.dilemma_title || item.dilemma_slug}</p>
                    <h2>{item.quote || `${item.author_name} chose ${item.choice}`}</h2>
                  </div>
                  <span className="admin-review-card__choice">Chose · {item.choice}</span>
                </div>

                <div className="admin-review-card__meta">
                  <strong>{item.author_name}</strong>
                  {item.author_role && <span>{item.author_role}</span>}
                  {item.graduation_year && <span>Class of {item.graduation_year}</span>}
                </div>

                <div className="admin-review-card__body">
                  <div>
                    <span>Background</span>
                    <p>{item.background || "Not provided."}</p>
                  </div>
                  <div>
                    <span>Context</span>
                    <p>{item.context || "Not provided."}</p>
                  </div>
                  <div>
                    <span>Why they chose {item.choice}</span>
                    <p>{item.why_choice || "Not provided."}</p>
                  </div>
                  <div>
                    <span>Outcome</span>
                    <p>{item.outcome || "Not provided."}</p>
                  </div>
                  <div>
                    <span>Key lesson</span>
                    <p>{item.lesson || "Not provided."}</p>
                  </div>
                </div>

                <details className="admin-review-card__details">
                  <summary>Read full submission</summary>
                  <div className="admin-review-card__full">
                    {[
                      ["What they did", item.what_did],
                      ["What worked", item.what_worked],
                      ["What did not", item.what_did_not],
                      ["What they would do differently", item.what_would_do_differently],
                      ["Full body", item.body],
                    ].map(([label, text]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <p>{text || "Not provided."}</p>
                      </div>
                    ))}
                  </div>
                </details>

                <div className="admin-review-card__moderation">
                  <label htmlFor={`note-${item.id}`}>Moderation note <span>(required for rejection)</span></label>
                  <textarea
                    id={`note-${item.id}`}
                    rows="3"
                    value={notes[item.id] || ""}
                    onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                    placeholder="Optional approval note or reason for rejection..."
                    disabled={actionId === item.id}
                  />
                  <div className="admin-review-card__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => moderate(item.id, "approve")}
                      disabled={actionId === item.id}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline admin-review-card__reject"
                      onClick={() => moderate(item.id, "reject")}
                      disabled={actionId === item.id}
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
