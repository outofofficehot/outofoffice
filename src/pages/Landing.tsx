import React from 'react';
import { brand, copy } from '../brand';
import { InterestedTeaser } from '../components/EmptyStates';

interface LandingProps {
  onLaunchApp: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLaunchApp }) => {
  return (
    <div style={styles.container}>
      {/* Mobile-optimized header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <img src="/assets/logo.png" alt="OOO" style={styles.navLogo} />
        </nav>

        <div style={styles.hero}>
          <img src="/assets/logo.png" alt="Out Of Office" style={styles.heroLogo} />
          <p style={styles.tagline}>{copy.hero.tagline}</p>
          <p style={styles.subline}>{copy.hero.subline}</p>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main style={styles.main}>
        {/* Teaser card - the viral hook */}
        <section style={styles.section}>
          <InterestedTeaser onSignUp={onLaunchApp} />
        </section>

        {/* How it works - mobile optimized */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{copy.howItWorks.title}</h2>
          <div style={styles.steps}>
            {copy.howItWorks.steps.map((step, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepNumber}>{i + 1}</div>
                <div style={styles.stepContent}>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust points */}
        <section style={styles.section}>
          <div style={styles.trustCard}>
            <h3 style={styles.trustTitle}>{copy.trust.title}</h3>
            <ul style={styles.trustList}>
              {copy.trust.points.map((point, i) => (
                <li key={i} style={styles.trustItem}>
                  <span style={styles.checkmark}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features grid - 2 column on mobile */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{copy.features.title}</h2>
          <div style={styles.featuresGrid}>
            {copy.features.items.map((item, i) => (
              <div key={i} style={styles.featureCard}>
                <h3 style={styles.featureTitle}>{item.title}</h3>
                <p style={styles.featureDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky bottom CTA - mobile pattern */}
      <footer style={styles.footer}>
        <button onClick={onLaunchApp} style={styles.ctaButton}>
          {copy.cta.primary}
        </button>
        <p style={styles.footerNote}>🔒 End-to-end encrypted</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100dvh', // Falls back to 100vh in older browsers
    display: 'flex',
    flexDirection: 'column',
    background: brand.colors.base,
    color: brand.colors.textPrimary,
    fontFamily: brand.fonts.body,
  },

  // Header
  header: {
    padding: `${brand.spacing.md} ${brand.spacing.lg}`,
    paddingTop: `max(${brand.spacing.md}, env(safe-area-inset-top))`,
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: brand.spacing.lg,
  },
  navLogo: {
    height: '32px',
    width: 'auto',
  },
  hero: {
    textAlign: 'center',
    paddingBottom: brand.spacing.lg,
  },
  heroLogo: {
    width: 'min(280px, 70vw)',
    height: 'auto',
    marginBottom: brand.spacing.md,
  },
  tagline: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(18px, 5vw, 24px)',
    color: brand.colors.rust,
    margin: `0 0 ${brand.spacing.xs} 0`,
  },
  subline: {
    fontSize: 'clamp(14px, 4vw, 16px)',
    color: brand.colors.textSecondary,
    margin: 0,
    padding: `0 ${brand.spacing.md}`,
  },

  // Main content
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: `0 ${brand.spacing.lg}`,
    paddingBottom: '120px', // Space for sticky footer
  },
  section: {
    marginBottom: brand.spacing.xl,
  },
  sectionTitle: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(22px, 5vw, 28px)',
    color: brand.colors.textPrimary,
    textAlign: 'center',
    marginBottom: brand.spacing.lg,
    fontWeight: 400,
  },

  // Steps - vertical on mobile
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: brand.spacing.md,
  },
  step: {
    display: 'flex',
    gap: brand.spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    background: brand.colors.rust,
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '16px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.xs} 0`,
    fontWeight: 400,
  },
  stepDesc: {
    fontSize: '14px',
    color: brand.colors.textSecondary,
    margin: 0,
    lineHeight: 1.5,
  },

  // Trust card
  trustCard: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.lg,
    boxShadow: brand.shadows.card,
  },
  trustTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '18px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.md} 0`,
    fontWeight: 400,
    textAlign: 'center',
  },
  trustList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.sm,
    padding: `${brand.spacing.sm} 0`,
    fontSize: '14px',
    color: brand.colors.textSecondary,
  },
  checkmark: {
    width: '20px',
    height: '20px',
    minWidth: '20px',
    background: brand.colors.rust,
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
  },

  // Features grid - 2 col
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: brand.spacing.md,
  },
  featureCard: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.md,
    padding: brand.spacing.md,
    boxShadow: brand.shadows.card,
  },
  featureTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '14px',
    color: brand.colors.rust,
    margin: `0 0 ${brand.spacing.xs} 0`,
    fontWeight: 400,
  },
  featureDesc: {
    fontSize: '12px',
    color: brand.colors.textSecondary,
    margin: 0,
    lineHeight: 1.4,
  },

  // Sticky footer
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(to top, ${brand.colors.base} 80%, transparent)`,
    padding: brand.spacing.lg,
    paddingBottom: `max(${brand.spacing.lg}, env(safe-area-inset-bottom))`,
    textAlign: 'center',
  },
  ctaButton: {
    width: '100%',
    maxWidth: '320px',
    padding: brand.spacing.md,
    background: brand.gradients.button,
    color: 'white',
    border: 'none',
    borderRadius: brand.borderRadius.full,
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
    boxShadow: brand.shadows.glow,
    touchAction: 'manipulation', // Faster taps on mobile
  },
  footerNote: {
    fontSize: '12px',
    color: brand.colors.textMuted,
    marginTop: brand.spacing.sm,
    marginBottom: 0,
  },
};

export default Landing;
