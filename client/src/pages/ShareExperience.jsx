import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../services/api';
import './ShareExperience.css';
import ExperienceAnalyzer from '../components/ai/ExperienceAnalyzer';

const STEPS = [
  { id: 1, label: 'About you' },
  { id: 2, label: 'Your dilemma' },
  { id: 3, label: 'Your decision' },
  { id: 4, label: 'Your experience' },
  { id: 5, label: 'Outcome & lesson' },
  { id: 6, label: 'Review & submit' },
];

const TEXT_FIELDS = [
  { key: 'background', label: 'Background', placeholder: 'Tell us about your profile and what led you here.' },
  { key: 'context', label: 'Context', placeholder: 'What was the situation? What trade-offs were in play?' },
  { key: 'whyChoice', label: 'Why this choice', placeholder: 'Why did you choose this option?' },
  { key: 'whatDid', label: 'What you did', placeholder: 'How did you proceed and what actions did you take?' },
  { key: 'whatWorked', label: 'What worked', placeholder: 'What helped or went well?' },
  { key: 'whatDidNot', label: 'What didn’t work', placeholder: 'What was challenging or what missed the mark?' },
  { key: 'whatWouldDoDifferently', label: 'What you’d do differently', placeholder: 'Any hindsight wisdom you’d share?' },
];

const initialForm = {
  name: '',
  currentRole: '',
  graduationYear: '',
  dilemma: '',
  decision: '',
  background: '',
  context: '',
  whyChoice: '',
  whatDid: '',
  whatWorked: '',
  whatDidNot: '',
  whatWouldDoDifferently: '',
  outcome: '',
  lesson: '',
};

export default function ShareExperience() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [dilemmas, setDilemmas] = useState([]);
  const [dilemmasLoading, setDilemmasLoading] = useState(true);
  const [dilemmasError, setDilemmasError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/dilemmas?limit=50')
      .then((data) => {
        if (!active) return;
        const items = data.items || [];
        setDilemmas(items);
        setFormData((prev) => {
          const current = items.find((item) => item.slug === prev.dilemma);
          const first = items[0];
          if (current) {
            const firstOption = current.options?.[0]?.label || current.left?.label;
            return { ...prev, decision: current.options?.some((o) => o.label === prev.decision) ? prev.decision : firstOption || prev.decision };
          }
          if (first) {
            return { ...prev, dilemma: first.slug, decision: first.options?.[0]?.label || first.left?.label || prev.decision };
          }
          return prev;
        });
      })
      .catch((error) => {
        if (active) setDilemmasError(error.message || 'Unable to load dilemmas.');
      })
      .finally(() => {
        if (active) setDilemmasLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedDilemma = useMemo(
    () => dilemmas.find((item) => item.slug === formData.dilemma) || null,
    [dilemmas, formData.dilemma]
  );

  const dilemmaOptions = selectedDilemma?.options?.length
    ? selectedDilemma.options.map((option) => ({ value: option.label, label: option.label }))
    : [selectedDilemma?.left?.label, selectedDilemma?.right?.label].filter(Boolean).map((label) => ({ value: label, label }));

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'dilemma') {
      const nextDilemma = dilemmas.find((item) => item.slug === value);
      const nextOptions = nextDilemma
        ? [nextDilemma.left?.label, nextDilemma.right?.label].filter(Boolean)
        : [];
      setFormData((prev) => ({ ...prev, dilemma: value, decision: nextOptions[0] || '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) nextErrors.name = 'Please enter your name.';
      if (!formData.currentRole.trim()) nextErrors.currentRole = 'Please add your current role.';
    }

    if (step === 2 && !formData.dilemma) {
      nextErrors.dilemma = 'Please select a dilemma.';
    }

    if (step === 3 && !formData.decision) {
      nextErrors.decision = 'Please choose one option.';
    }

    if (step === 4) {
      TEXT_FIELDS.forEach(({ key }) => {
        if (!formData[key]?.trim()) {
          nextErrors[key] = 'This field is required.';
        }
      });
    }

    if (step === 5) {
      if (!formData.outcome.trim()) nextErrors.outcome = 'Please share the outcome.';
      if (!formData.lesson.trim()) nextErrors.lesson = 'Please add your biggest lesson.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const submitForm = async () => {
    const valid = [5, 4, 3, 2, 1].every((step) => validateStep(step));
    if (!valid) {
      setCurrentStep(1);
      return;
    }


    setIsSubmitting(true);
    setSubmitError('');

    try {
      await apiRequest('/experiences/submit', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          currentRole: formData.currentRole,
          graduationYear: formData.graduationYear || null,
          dilemmaSlug: formData.dilemma,
          decision: formData.decision,
          background: formData.background,
          context: formData.context,
          whyChoice: formData.whyChoice,
          whatDid: formData.whatDid,
          whatWorked: formData.whatWorked,
          whatDidNot: formData.whatDidNot,
          whatWouldDoDifferently: formData.whatWouldDoDifferently,
          outcome: formData.outcome,
          lesson: formData.lesson,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit your experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue = (step) => {
    if (step === 1) return formData.name.trim() && formData.currentRole.trim();
    if (step === 2) return Boolean(formData.dilemma);
    if (step === 3) return Boolean(formData.decision);
    if (step === 4) return TEXT_FIELDS.every(({ key }) => formData[key]?.trim());
    if (step === 5) return formData.outcome.trim() && formData.lesson.trim();
    return true;
  };

  return (
    <div className="share-experience-page">
      <main className="share-experience-main">
        <header className="share-header">
          <span className="section-badge">SHARE YOUR EXPERIENCE</span>
          <h1 className="share-title">Help the next student see what you saw.</h1>
          <p className="share-subtitle">
            Six short steps. Answer honestly. Skip anything you're not comfortable sharing.
          </p>
        </header>

        <div className="share-container">
          <aside className="steps-sidebar">
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`step-item ${isActive ? 'active' : ''}`}
                >
                  <span className="step-number">0{step.id} / 06</span>
                  <span className="step-label">{step.label}</span>
                </button>
              );
            })}
          </aside>

          <section className="step-content">
            <span className="step-tracker-badge">STEP {currentStep} OF 6</span>
            <h2 className="step-heading">{STEPS[currentStep - 1].label}</h2>

            {!submitted && (
              <>
                {currentStep === 1 && (
                  <div className="step-form">
                    <div className="form-group">
                      <label htmlFor="name" className="field-label">YOUR NAME *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`minimal-input ${errors.name ? 'has-error' : ''}`}
                        placeholder="Aditi Sharma"
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="currentRole" className="field-label">CURRENT ROLE *</label>
                      <input
                        type="text"
                        id="currentRole"
                        name="currentRole"
                        value={formData.currentRole}
                        onChange={handleChange}
                        className={`minimal-input ${errors.currentRole ? 'has-error' : ''}`}
                        placeholder="SDE-1 at Atlassian · Final year B.Tech"
                      />
                      {errors.currentRole && <span className="field-error">{errors.currentRole}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="graduationYear" className="field-label">GRADUATION YEAR</label>
                      <input
                        type="text"
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        className="minimal-input"
                        placeholder="2025"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-form">
                    {dilemmasError && <span className="field-error">{dilemmasError}</span>}
                    {dilemmasLoading && <p className="share-subtitle">Loading available dilemmas...</p>}
                    <div className="form-group">
                      <label htmlFor="dilemma" className="field-label">SELECT A DILEMMA *</label>
                      <select
                        id="dilemma"
                        name="dilemma"
                        value={formData.dilemma}
                        onChange={handleChange}
                        className={`minimal-select ${errors.dilemma ? 'has-error' : ''}`}
                      >
                        {dilemmas.map((item) => (
                          <option key={item.slug} value={item.slug}>{item.title}</option>
                        ))}
                      </select>
                      {errors.dilemma && <span className="field-error">{errors.dilemma}</span>}
                    </div>

                    <div className="summary-card">
                      <span className="summary-card__label">Selected dilemma</span>
                      <strong>{selectedDilemma?.title || (dilemmasLoading ? 'Loading…' : 'No dilemma selected')}</strong>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-form">
                    <div className="choice-grid">
                      {dilemmaOptions.map((option) => (
                        option.label && (
                        <label key={option.value} className={`choice-option ${formData.decision === option.value ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="decision"
                            value={option.value}
                            checked={formData.decision === option.value}
                            onChange={handleChange}
                          />
                          <span>{option.label}</span>
                        </label>
                        )
                      ))}
                    </div>
                    {errors.decision && <span className="field-error">{errors.decision}</span>}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="step-form">
                    {TEXT_FIELDS.map(({ key, label, placeholder }) => (
                      <div key={key} className="form-group">
                        <label htmlFor={key} className="field-label">{label.toUpperCase()} *</label>
                        <textarea
                          id={key}
                          name={key}
                          value={formData[key]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className={`minimal-textarea ${errors[key] ? 'has-error' : ''}`}
                          rows={5}
                        />
                        <div className="field-meta">
                          <span>{formData[key]?.length || 0} chars</span>
                        </div>
                        {errors[key] && <span className="field-error">{errors[key]}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="step-form">
                    <div className="form-group">
                      <label htmlFor="outcome" className="field-label">OUTCOME *</label>
                      <textarea
                        id="outcome"
                        name="outcome"
                        value={formData.outcome}
                        onChange={handleChange}
                        placeholder="What was the result?"
                        className={`minimal-textarea ${errors.outcome ? 'has-error' : ''}`}
                        rows={5}
                      />
                      {errors.outcome && <span className="field-error">{errors.outcome}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lesson" className="field-label">KEY LESSON *</label>
                      <textarea
                        id="lesson"
                        name="lesson"
                        value={formData.lesson}
                        onChange={handleChange}
                        placeholder="Most important lesson..."
                        className={`minimal-textarea ${errors.lesson ? 'has-error' : ''}`}
                        rows={4}
                      />
                      {errors.lesson && <span className="field-error">{errors.lesson}</span>}
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="review-panel">
                    <div className="review-grid">
                      <div className="review-row"><span>Name</span><strong>{formData.name}</strong></div>
                      <div className="review-row"><span>Role</span><strong>{formData.currentRole}</strong></div>
                      <div className="review-row"><span>Graduation</span><strong>{formData.graduationYear || 'Not provided'}</strong></div>
                      <div className="review-row"><span>Dilemma</span><strong>{selectedDilemma?.title || (dilemmasLoading ? 'Loading…' : 'No dilemma selected')}</strong></div>
                      <div className="review-row"><span>Decision</span><strong>{formData.decision}</strong></div>
                    </div>

                    <div className="review-blocks">
                      {TEXT_FIELDS.map(({ key, label }) => (
                        <div key={key} className="review-block">
                          <h3>{label}</h3>
                          <p>{formData[key] || 'Not provided yet.'}</p>
                        </div>
                      ))}

                      <div className="review-block">
                        <h3>Outcome</h3>
                        <p>{formData.outcome || 'Not provided yet.'}</p>
                      </div>

                      <div className="review-block">
                        <h3>Key lesson</h3>
                        <p>{formData.lesson || 'Not provided yet.'}</p>
                      </div>
                    </div>
                    <ExperienceAnalyzer formData={formData} />
                  </div>
                )}

                {submitError && <p className="field-error" role="alert">{submitError}</p>}

                <div className="step-actions">
                  {currentStep > 1 && (
                    <button type="button" className="btn btn--outline" onClick={goBack}>
                      Back
                    </button>
                  )}

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={goNext}
                      disabled={!canContinue(currentStep)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={submitForm}
                      disabled={!canContinue(currentStep) || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit experience'}
                    </button>
                  )}
                </div>
              </>
            )}

            {submitted && (
              <div className="success-state">
                <span className="success-badge">Submitted</span>
                <h3>Thanks for sharing your experience.</h3>
                <p>
                  Your story is ready for review and will help future students make more informed decisions.
                </p>
                <button type="button" className="btn btn--primary" onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setFormData(initialForm);
                  setErrors({});
                }}>
                  Share another experience
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}