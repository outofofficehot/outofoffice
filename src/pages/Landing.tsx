import React from 'react';
import { brand, copy } from '../brand';

const Landing: React.FC<{ onLaunchApp: () => void }> = ({ onLaunchApp }) => {
  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <img src="/assets/logo.png" alt="OOO" style={styles.navLogo} />
        <button onClick={onLaunchApp} style={styles.navButton}>
          {copy.cta.primary}
        </button>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero}>
        <img src="/assets/logo.png" alt="Out Of Office" style={styles.heroLogo} />
        <p style={styles.tagline}>{copy.hero.tagline}</p>
        <p style={styles.subline}>{copy.hero.subline}</p>
        
        <button onClick={onLaunchApp} style={styles.ctaButton}>
          {copy.cta.primary}
        </button>
        
        <p style={styles.trustBadge}>
          🔒 End-to-end encrypted • Built on Aztec
        </p>
      </header>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{copy.howItWorks.title}</h2>
        
        <div style={styles.stepsGrid}>
          {copy.howItWorks.steps.map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ ...styles.section, ...styles.sectionAlt }}>
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

      {/* Trust Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>{copy.trust.title}</h2>
        
        <div style={styles.trustList}>
          {copy.trust.points.map((point, i) => (
            <div key={i} style={styles.trustItem}>
              <span style={styles.checkmark}>✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to find out?</h2>
        <p style={styles.ctaSubtitle}>The only risk is not knowing.</p>
        <button onClick={onLaunchApp} style={styles.ctaButtonLarge}>
          {copy.cta.primary}
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <img src="/assets/logo.png" alt="OOO" style={styles.footerLogo} />
        <p style={styles.footerTagline}>{copy.footer.tagline}</p>
        <div style={styles.footerLinks}>
          <a href="https://github.com/outofofficehot/outofoffice" style={styles.footerLink}>
            GitHub
          </a>
          <span style={styles.footerDivider}>•</span>
          <a href="https://aztec.network" style={styles.footerLink}>
            Built on Aztec
          </a>
        </div>
        <p style={styles.footerNote}>Alpha • Use test funds only</p>
      </footer>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: brand.colors.base,
    color: brand.colors.textPrimary,
    fontFamily: brand.fonts.body,
  },
  
  // Navigation
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${brand.spacing.md} ${brand.spacing.xl}`,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  navLogo: {
    height: '40px',
    width: 'auto',
  },
  navButton: {
    background: 'transparent',
    border: `2px solid ${brand.colors.rust}`,
    color: brand.colors.rust,
    padding: `${brand.spacing.sm} ${brand.spacing.lg}`,
    borderRadius: brand.borderRadius.full,
    fontFamily: brand.fonts.body,
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Hero
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: `${brand.spacing.xxxl} ${brand.spacing.xl}`,
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroLogo: {
    width: 'min(400px, 80vw)',
    height: 'auto',
    marginBottom: brand.spacing.xl,
  },
  tagline: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(20px, 4vw, 28px)',
    color: brand.colors.rust,
    margin: `0 0 ${brand.spacing.md} 0`,
    fontWeight: 400,
  },
  subline: {
    fontSize: 'clamp(16px, 2.5vw, 20px)',
    color: brand.colors.textSecondary,
    margin: `0 0 ${brand.spacing.xl} 0`,
    maxWidth: '500px',
    lineHeight: 1.6,
  },
  ctaButton: {
    background: brand.gradients.button,
    border: 'none',
    color: brand.colors.white,
    padding: `${brand.spacing.md} ${brand.spacing.xxl}`,
    borderRadius: brand.borderRadius.full,
    fontFamily: brand.fonts.body,
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: brand.shadows.glow,
    transition: 'all 0.2s ease',
  },
  trustBadge: {
    marginTop: brand.spacing.xl,
    fontSize: '14px',
    color: brand.colors.textMuted,
  },

  // Sections
  section: {
    padding: `${brand.spacing.xxxl} ${brand.spacing.xl}`,
    maxWidth: '1000px',
    margin: '0 auto',
  },
  sectionAlt: {
    background: brand.colors.pinkLight,
    maxWidth: '100%',
    borderRadius: 0,
  },
  sectionTitle: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(28px, 5vw, 36px)',
    color: brand.colors.textPrimary,
    textAlign: 'center',
    marginBottom: brand.spacing.xxl,
    fontWeight: 400,
  },

  // Steps
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: brand.spacing.lg,
  },
  stepCard: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.xl,
    boxShadow: brand.shadows.card,
    textAlign: 'center',
    position: 'relative',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    background: brand.colors.rust,
    color: brand.colors.white,
    borderRadius: brand.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '16px',
    margin: '0 auto',
    marginBottom: brand.spacing.md,
  },
  stepTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '18px',
    color: brand.colors.textPrimary,
    marginBottom: brand.spacing.sm,
    fontWeight: 400,
  },
  stepDesc: {
    fontSize: '14px',
    color: brand.colors.textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },

  // Features
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: brand.spacing.lg,
    maxWidth: '900px',
    margin: '0 auto',
  },
  featureCard: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.xl,
    boxShadow: brand.shadows.card,
  },
  featureTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '20px',
    color: brand.colors.rust,
    marginBottom: brand.spacing.sm,
    fontWeight: 400,
  },
  featureDesc: {
    fontSize: '15px',
    color: brand.colors.textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },

  // Trust
  trustList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: brand.spacing.md,
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.md,
    fontSize: '18px',
    color: brand.colors.textPrimary,
  },
  checkmark: {
    width: '28px',
    height: '28px',
    background: brand.colors.rust,
    color: brand.colors.white,
    borderRadius: brand.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
  },

  // CTA Section
  ctaSection: {
    background: brand.gradients.subtle,
    textAlign: 'center',
    padding: `${brand.spacing.xxxl} ${brand.spacing.xl}`,
  },
  ctaTitle: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(32px, 6vw, 44px)',
    color: brand.colors.textPrimary,
    marginBottom: brand.spacing.md,
    fontWeight: 400,
  },
  ctaSubtitle: {
    fontSize: '18px',
    color: brand.colors.textSecondary,
    marginBottom: brand.spacing.xl,
  },
  ctaButtonLarge: {
    background: brand.gradients.button,
    border: 'none',
    color: brand.colors.white,
    padding: `${brand.spacing.lg} ${brand.spacing.xxxl}`,
    borderRadius: brand.borderRadius.full,
    fontFamily: brand.fonts.body,
    fontWeight: 600,
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: brand.shadows.glow,
    transition: 'all 0.2s ease',
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: `${brand.spacing.xxl} ${brand.spacing.xl}`,
    borderTop: `1px solid ${brand.colors.pinkDark}`,
  },
  footerLogo: {
    height: '48px',
    width: 'auto',
    marginBottom: brand.spacing.md,
    opacity: 0.8,
  },
  footerTagline: {
    fontFamily: brand.fonts.display,
    fontSize: '16px',
    color: brand.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: brand.spacing.md,
  },
  footerLinks: {
    marginBottom: brand.spacing.md,
  },
  footerLink: {
    color: brand.colors.rust,
    textDecoration: 'none',
    fontSize: '14px',
  },
  footerDivider: {
    margin: `0 ${brand.spacing.md}`,
    color: brand.colors.textMuted,
  },
  footerNote: {
    fontSize: '12px',
    color: brand.colors.textMuted,
  },
};

export default Landing;
