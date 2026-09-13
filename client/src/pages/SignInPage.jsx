import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./SignInPage.css";

export default function SignInPage({ onAuthSuccess, initialTab = "signin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(initialTab); // "signin" | "create"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password;
    const normalizedConfirmPassword = confirmPassword;

    if (tab === "create" && !normalizedName) {
      setError("Please enter your name.");
      setSuccess("");
      return;
    }

    if (!normalizedEmail || !normalizedPassword) {
      setError("Please enter both email and password.");
      setSuccess("");
      return;
    }

    if (tab === "create" && normalizedPassword !== normalizedConfirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = tab === "create"
        ? await authApi.register(normalizedName, normalizedEmail, normalizedPassword)
        : await authApi.login(normalizedEmail, normalizedPassword);
      onAuthSuccess(result.user);
      setSuccess(tab === "create" ? "Account created. Redirecting..." : "Signed in successfully. Redirecting...");
      setTimeout(() => navigate(location.state?.from || "/dilemmas", { replace: true }), 500);
    } catch (requestError) {
      setError(requestError.message);
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="signin-page">
      <div className="container signin-page__grid">
        <div className="signin-page__intro">
          <span className="eyebrow">Pathfinder Access</span>
          <h1 className="signin-page__heading">Welcome back.</h1>
          <p className="signin-page__subtext">
            Sign in to save dilemmas, follow contributors, and track your own decision journey.
            Reading is always free — no account required.
          </p>

          <ul className="signin-page__list">
            <li>No spam, ever.</li>
            <li>Your experiences remain yours.</li>
            <li>Anonymity is opt-in for sensitive topics.</li>
          </ul>
        </div>

        <div className="signin-card">
          <div className="signin-card__tabs">
            <button
              type="button"
              className={`signin-card__tab ${tab === "signin" ? "is-active" : ""}`}
              onClick={() => {
                setTab("signin");
                setError("");
                setSuccess("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`signin-card__tab ${tab === "create" ? "is-active" : ""}`}
              onClick={() => {
                setTab("create");
                setError("");
                setSuccess("");
              }}
            >
              Create account
            </button>
          </div>

          <form className="signin-card__form" onSubmit={handleSubmit}>
            {tab === "create" && (
              <div className="signin-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                  required
                />
              </div>
            )}

            <div className="signin-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="signin-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={tab === "create" ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </div>

            {tab === "create" && (
              <div className="signin-field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            )}

            {error && <p className="signin-card__message signin-card__message--error">{error}</p>}
            {success && <p className="signin-card__message signin-card__message--success">{success}</p>}

            <button type="submit" className="btn btn--primary signin-card__submit">
              {isSubmitting ? "Connecting..." : tab === "signin" ? "Sign in" : "Create account"}
            </button>

            <p className="signin-card__terms">
              By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}