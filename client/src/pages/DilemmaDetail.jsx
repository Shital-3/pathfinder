import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './DilemmaDetailResponsive.css';
import AiAdvisor from '../components/ai/AiAdvisor';

function buildPageData(data, related = []) {
  const distribution = (data.distribution || []).map((item) => ({
    name: item.label,
    percentage: `${item.percentage}%`,
  }));

  return {
    category: String(data.category || '').toUpperCase(),
    experiencesCount: `${data.experienceCount || 0} EXPERIENCES`,
    title: data.title,
    subtitle: data.description,
    tags: data.tags || [],
    contextText: data.context || data.description,
    distribution: {
      title: 'COMMUNITY DISTRIBUTION',
      subtitle: `How ${data.experienceCount || 0} contributors chose:`,
      options: distribution,
    },
    tradeoffs: (data.tradeoffs || []).map((row) => ({
      metric: row.metric,
      dsa: row.left_value,
      projects: row.right_value,
    })),
    experiences: (data.experiences || []).map((exp) => ({
      id: exp.id,
      choice: `CHOSE: ${exp.choice}`,
      title: exp.quote || exp.lesson || 'Shared experience',
      subtitle: exp.body || exp.outcome || '',
      author: exp.contributor_name || exp.author_name || 'Anonymous contributor',
      role: exp.role_title || exp.author_role || 'Student contributor',
    })),
    wisdomPoints: [
      'This distribution reflects published contributor experiences, not a recommendation.',
      'Use the experiences to understand the trade-offs behind each choice.',
      'Your own timeline, goals, and starting point should guide your decision.',
    ],
    relatedDilemmas: related.filter((item) => item.slug !== data.slug).slice(0, 2).map((item) => ({
      category: String(item.category || '').toUpperCase(),
      experiences: `${item.experienceCount || 0} EXPERIENCES`,
      title: item.title,
      subtitle: item.description,
      optionA: item.left?.label || 'Option A',
      valA: `${item.left?.percent ?? 0}%`,
      optionB: item.right?.label || 'Option B',
      valB: `${item.right?.percent ?? 0}%`,
    })),
  };
}

export default function DilemmaDetailPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiRequest(`/dilemmas/${slug}`),
      apiRequest('/dilemmas?limit=50'),
    ])
      .then(([dilemma, list]) => {
        if (!cancelled) setPageData(buildPageData(dilemma, list.items || []));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Dilemma not found');
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (!pageData && !error) {
    return <div className="dilemma-inline-container" style={styles.contentContainer}><p>Loading dilemma...</p></div>;
  }

  if (error || !pageData) {
    return (
      <div className="dilemma-inline-container" style={styles.contentContainer}>
        <h1>Dilemma not found</h1>
        <p>{error || 'This dilemma may have been removed.'}</p>
        <Link to="/dilemmas">Back to dilemmas</Link>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Main Content Outer Shell with expanded max-width (1200px) */}
      <div className="dilemma-inline-container" style={styles.contentContainer}>
        {/* 1. Hero Title Section */}
        <section style={styles.heroSection}>
          <div style={styles.metaRow}>
            <span style={styles.categoryTag}>{pageData.category}</span>
            <span style={styles.expCount}>{pageData.experiencesCount}</span>
          </div>
          <h1 style={styles.mainTitle}>{pageData.title}</h1>
          <p style={styles.mainSubtitle}>{pageData.subtitle}</p>
          <div style={styles.tagGroup}>
            {pageData.tags.map((tag, i) => (
              <span key={i} style={styles.tagPill}>{tag}</span>
            ))}
          </div>
        </section>

        {/* 2. Context & Distribution 2-Column Split */}
        <section className="dilemma-inline-context" style={styles.contextGrid}>
          <div>
            <span style={styles.sectionLabel}>CONTEXT</span>
            <p style={styles.contextBody}>{pageData.contextText}</p>
          </div>
          <div style={styles.distributionBox}>
            <span style={styles.distHeaderLabel}>{pageData.distribution.title}</span>
            <p style={styles.distSubLabel}>{pageData.distribution.subtitle}</p>
            
            {pageData.distribution.options.map((opt, i) => (
              <div key={i} style={styles.distBarRow}>
                <div style={styles.distBarLabelRow}>
                  <span>{opt.name}</span>
                  <span>{opt.percentage}</span>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: opt.percentage }} />
                </div>
              </div>
            ))}
            <p style={styles.disclaimer}>Distribution shows contributor choices — not a recommendation.</p>
          </div>
        </section>

        <AiAdvisor dilemmaSlug={slug} />

        {/* 3. Trade-off Matrix Section */}
        <section style={styles.sectionMargin}>
          <span style={styles.sectionLabel}>TRADE-OFF MATRIX</span>
          <h2 style={styles.serifHeading}>{pageData.title}, side by side.</h2>

          <div className="dilemma-inline-table" style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.trHead}>
                  <th style={{ ...styles.th, width: '45%' }}>
                    TRADE-OFF MATRIX<br /><span style={styles.thSub}>{pageData.title}</span>
                  </th>
                  <th style={{ ...styles.th, width: '27.5%' }}>{pageData.distribution.options[0]?.name || 'Option A'}</th>
                  <th style={{ ...styles.th, width: '27.5%' }}>{pageData.distribution.options[1]?.name || 'Option B'}</th>
                </tr>
              </thead>
              <tbody>
                {pageData.tradeoffs.map((row, idx) => (
                  <tr key={idx} style={styles.tr}>
                    <td style={styles.tdMetric}>{row.metric}</td>
                    <td style={{ ...styles.td, color: row.dsaHigh ? '#1E1E1E' : '#6E6E6E', fontWeight: row.dsaHigh ? '600' : '400' }}>{row.dsa}</td>
                    <td style={{ ...styles.td, color: row.projHigh ? '#1E1E1E' : '#6E6E6E', fontWeight: row.projHigh ? '600' : '400' }}>{row.projects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.tableCaption}>Source: aggregated contributor data</div>
          </div>
        </section>

        {/* 4. Real Experiences Cards */}
        <section style={styles.sectionMargin}>
          <span style={styles.sectionLabel}>REAL EXPERIENCES</span>
          <h2 style={styles.serifHeading}>From students who chose.</h2>

          <div className="dilemma-inline-experiences" style={styles.expGrid}>
            {pageData.experiences.map((exp) => (
              <Link key={exp.id} to={`/experiences/${exp.id}`} style={{ ...styles.expCard, textDecoration: 'none', color: 'inherit' }}>
                <span style={styles.choiceBadge}>{exp.choice}</span>
                <h3 style={styles.expTitle}>{exp.title}</h3>
                <p style={styles.expSubtitle}>{exp.subtitle}</p>
                <div style={styles.authorRow}>
                  <div style={styles.avatar}>{exp.author.charAt(0)}</div>
                  <div>
                    <div style={styles.authorName}>{exp.author}</div>
                    <div style={styles.authorRole}>{exp.role}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Pixel-Perfect Key Insights Banner */}
      <section className="dilemma-inline-wisdom" style={styles.wisdomBannerFullBleed}>
        <div className="dilemma-inline-banner-inner" style={styles.bannerInnerContainer}>
          <div style={styles.tagWrapper}>
            <span style={styles.keyInsightsTag}>KEY INSIGHTS</span>
          </div>
          <h2 style={styles.wisdomHeading}>What the collective wisdom says.</h2>
          <div style={styles.wisdomList}>
            {pageData.wisdomPoints.map((point, idx) => (
              <div key={idx} style={styles.wisdomItem}>
                <span style={styles.wisdomIndex}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p style={styles.wisdomText}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Related Dilemmas */}
      <div className="dilemma-inline-container" style={styles.contentContainer}>
        <section style={styles.sectionMargin}>
          <div className="dilemma-inline-related" style={styles.relatedGrid}>
            {pageData.relatedDilemmas.map((item, idx) => (
              <div key={idx} style={styles.relatedCard}>
                <div style={styles.metaRow}>
                  <span style={styles.categoryTag}>{item.category}</span>
                  <span style={styles.expCount}>{item.experiences}</span>
                </div>
                <h3 style={styles.relatedTitle}>{item.title}</h3>
                <p style={styles.relatedSubtitle}>{item.subtitle}</p>
                <div style={styles.relatedBarTrack}>
                  <div style={{ ...styles.relatedBarFill, width: item.valA }} />
                </div>
                <div style={styles.relatedBarLabels}>
                  <span>{item.optionA} {item.valA}</span>
                  <span>{item.optionB} {item.valB}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#F7F5F0',
    minHeight: '100vh',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#2A2D2B',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 32px',
  },
  heroSection: {
    marginBottom: '56px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  categoryTag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#3B413D',
  },
  expCount: {
    fontSize: '0.72rem',
    color: '#8C908D',
    letterSpacing: '0.05em',
  },
  mainTitle: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
    fontWeight: '400',
    lineHeight: '1.08',
    margin: '0 0 16px 0',
    color: '#1E1E1E',
  },
  mainSubtitle: {
    fontSize: '1.1rem',
    color: '#5C605D',
    lineHeight: '1.5',
    maxWidth: '800px',
    marginBottom: '24px',
  },
  tagGroup: {
    display: 'flex',
    gap: '8px',
  },
  tagPill: {
    fontSize: '0.78rem',
    padding: '5px 14px',
    backgroundColor: '#EAE7E1',
    color: '#4A4D4A',
    borderRadius: '9999px',
  },
  contextGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '64px',
    alignItems: 'start',
    marginBottom: '64px',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#8C908D',
    display: 'block',
    marginBottom: '10px',
  },
  contextBody: {
    fontSize: '1.15rem',
    lineHeight: '1.6',
    color: '#2A2D2B',
  },
  distributionBox: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E2DC',
    borderRadius: '8px',
    padding: '24px',
  },
  distHeaderLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#8C908D',
    display: 'block',
  },
  distSubLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '4px 0 20px 0',
  },
  distBarRow: {
    marginBottom: '16px',
  },
  distBarLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginBottom: '6px',
  },
  barTrack: {
    height: '6px',
    backgroundColor: '#EAE7E1',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1E1E1E',
  },
  disclaimer: {
    fontSize: '0.72rem',
    color: '#8C908D',
    margin: '16px 0 0 0',
  },
  sectionMargin: {
    marginBottom: '64px',
  },
  serifHeading: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontSize: '2.4rem',
    fontWeight: '400',
    margin: '0 0 28px 0',
    color: '#1E1E1E',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E2DC',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  trHead: {
    borderBottom: '1px solid #E5E2DC',
  },
  th: {
    padding: '18px 24px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#2A2D2B',
  },
  thSub: {
    fontSize: '0.72rem',
    fontWeight: '400',
    color: '#8C908D',
  },
  tr: {
    borderBottom: '1px solid #F0ECE5',
  },
  tdMetric: {
    padding: '16px 24px',
    fontSize: '0.9rem',
    color: '#5C605D',
  },
  td: {
    padding: '16px 24px',
    fontSize: '0.9rem',
  },
  tableCaption: {
    padding: '14px 24px',
    fontSize: '0.75rem',
    color: '#8C908D',
    backgroundColor: '#FAF8F5',
  },
  expGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  expCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E2DC',
    borderRadius: '8px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  choiceBadge: {
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#8C908D',
    display: 'block',
    marginBottom: '14px',
  },
  expTitle: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontSize: '1.4rem',
    fontWeight: '400',
    lineHeight: '1.3',
    margin: '0 0 12px 0',
  },
  expSubtitle: {
    fontSize: '0.9rem',
    color: '#5C605D',
    lineHeight: '1.45',
    marginBottom: '24px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#22382F',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  authorName: {
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  authorRole: {
    fontSize: '0.75rem',
    color: '#8C908D',
  },
  /* Key Insights Dark Green Banner */
  wisdomBannerFullBleed: {
    backgroundColor: '#2C4A3E',
    color: '#FFFFFF',
    padding: '72px 0',
    width: '100%',
  },
  bannerInnerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
  },
  tagWrapper: {
    marginBottom: '16px',
  },
  keyInsightsTag: {
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '0.12em',
    color: '#A2C2B5',
    borderTop: '1px solid #486A5D',
    borderBottom: '1px solid #486A5D',
    padding: '3px 0',
    display: 'inline-block',
  },
  wisdomHeading: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
    fontWeight: '400',
    lineHeight: '1.1',
    margin: '0 0 48px 0',
    color: '#FFFFFF',
  },
  wisdomList: {
    display: 'flex',
    flexDirection: 'column',
  },
  wisdomItem: {
    display: 'grid',
    gridTemplateColumns: '48px 1fr',
    alignItems: 'baseline',
    padding: '28px 0',
    borderTop: '1px solid #3E5F52',
  },
  wisdomIndex: {
    fontFamily: '"JetBrains Mono", monospace, sans-serif',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#8CAE9E',
    letterSpacing: '0.05em',
  },
  wisdomText: {
    fontFamily: '"Instrument Serif", Georgia, serif',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
    fontWeight: '400',
    lineHeight: '1.4',
    color: '#F4F7F5',
    margin: 0,
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  relatedCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E2DC',
    borderRadius: '8px',
    padding: '24px',
  },
  relatedTitle: {
    fontSize: '1.15rem',
    fontWeight: '600',
    margin: '10px 0',
  },
  relatedSubtitle: {
    fontSize: '0.88rem',
    color: '#5C605D',
    marginBottom: '20px',
  },
  relatedBarTrack: {
    height: '4px',
    backgroundColor: '#EAE7E1',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  relatedBarFill: {
    height: '100%',
    backgroundColor: '#1E1E1E',
  },
  relatedBarLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#8C908D',
  },
};