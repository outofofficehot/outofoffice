import React from 'react';

const Landing: React.FC<{ onLaunchApp: () => void }> = ({ onLaunchApp }) => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <nav style={styles.nav}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏖️</span>
            <span style={styles.logoText}>OOO</span>
          </div>
          <button onClick={onLaunchApp} style={styles.navButton}>
            Launch App
          </button>
        </nav>

        <div style={styles.heroContent}>
          <h1 style={styles.headline}>
            Out Of Office
          </h1>
          <p style={styles.tagline}>
            Private mutual interest signaling for the workplace.
          </p>
          <p style={styles.subtagline}>
            When "let's grab coffee" means something more.
          </p>
          
          <button onClick={onLaunchApp} style={styles.ctaButton}>
            Signal Someone →
          </button>
          
          <p style={styles.privacyNote}>
            🔒 Built on Aztec Network • Zero-knowledge privacy
          </p>
        </div>
      </header>

      {/* How It Works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>🔗</div>
            <h3 style={styles.stepTitle}>Paste Their LinkedIn</h3>
            <p style={styles.stepDesc}>
              Enter the LinkedIn profile of someone you're interested in.
            </p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>💰</div>
            <h3 style={styles.stepTitle}>Stake $10</h3>
            <p style={styles.stepDesc}>
              Put skin in the game. Shows you're serious, prevents spam.
            </p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🔒</div>
            <h3 style={styles.stepTitle}>Signal Privately</h3>
            <p style={styles.stepDesc}>
              Your interest is encrypted. Only you can see your outgoing signals.
            </p>
          </div>
          
          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <div style={styles.stepIcon}>✨</div>
            <h3 style={styles.stepTitle}>Mutual = Match</h3>
            <p style={styles.stepDesc}>
              If they signal you back, you both get notified. If not, nobody knows.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section style={{ ...styles.section, ...styles.sectionAlt }}>
        <h2 style={styles.sectionTitle}>The Problem</h2>
        
        <div style={styles.problemGrid}>
          <div style={styles.problemCard}>
            <span style={styles.problemIcon}>😬</span>
            <h3>Rejection Risk</h3>
            <p>Expressing interest to a colleague can make work awkward forever.</p>
          </div>
          
          <div style={styles.problemCard}>
            <span style={styles.problemIcon}>⚖️</span>
            <h3>Power Dynamics</h3>
            <p>Seniority differences make it inappropriate to make the first move.</p>
          </div>
          
          <div style={styles.problemCard}>
            <span style={styles.problemIcon}>📋</span>
            <h3>HR Policies</h3>
            <p>Many companies discourage workplace relationships entirely.</p>
          </div>
          
          <div style={styles.problemCard}>
            <span style={styles.problemIcon}>🗣️</span>
            <h3>Office Gossip</h3>
            <p>Word gets around. Your interest becomes everyone's business.</p>
          </div>
        </div>
        
        <div style={styles.solution}>
          <h3 style={styles.solutionTitle}>The Solution: Cryptographic Discretion</h3>
          <p style={styles.solutionDesc}>
            OOO uses <strong>zero-knowledge proofs</strong> to ensure your interest 
            is mathematically hidden unless it's mutual. Not even we can see who 
            you've signaled.
          </p>
        </div>
      </section>

      {/* Privacy Deep Dive */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Privacy Guarantees</h2>
        
        <div style={styles.privacyGrid}>
          <div style={styles.privacyItem}>
            <span style={styles.checkmark}>✓</span>
            <div>
              <strong>Signal Privacy</strong>
              <p>Your signal is a private encrypted note. Only you can decrypt it.</p>
            </div>
          </div>
          
          <div style={styles.privacyItem}>
            <span style={styles.checkmark}>✓</span>
            <div>
              <strong>Identity Hashing</strong>
              <p>LinkedIn IDs are hashed before going on-chain. No raw profiles stored.</p>
            </div>
          </div>
          
          <div style={styles.privacyItem}>
            <span style={styles.checkmark}>✓</span>
            <div>
              <strong>No Rejection Info</strong>
              <p>If someone doesn't signal back, you learn absolutely nothing.</p>
            </div>
          </div>
          
          <div style={styles.privacyItem}>
            <span style={styles.checkmark}>✓</span>
            <div>
              <strong>Stake Recovery</strong>
              <p>No match after 30 days? Withdraw your stake. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to find out?</h2>
        <p style={styles.ctaDesc}>
          The only risk is not knowing.
        </p>
        <button onClick={onLaunchApp} style={styles.ctaButtonLarge}>
          Launch App 🏖️
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.logoIcon}>🏖️</span>
            <span>Out Of Office</span>
          </div>
          <div style={styles.footerLinks}>
            <a href="https://aztec.network" target="_blank" rel="noopener" style={styles.footerLink}>
              Built on Aztec
            </a>
            <span style={styles.footerDivider}>•</span>
            <a href="https://github.com" target="_blank" rel="noopener" style={styles.footerLink}>
              GitHub
            </a>
          </div>
          <p style={styles.footerNote}>
            ⚠️ Alpha software. Use test tokens only.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  
  // Hero
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '2px',
  },
  navButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  heroContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px',
  },
  headline: {
    fontSize: 'clamp(48px, 10vw, 80px)',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    background: 'linear-gradient(135deg, #fff 0%, #a0a0a0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontSize: 'clamp(18px, 3vw, 24px)',
    color: '#e94560',
    margin: '0 0 10px 0',
    fontWeight: '500',
  },
  subtagline: {
    fontSize: 'clamp(16px, 2.5vw, 20px)',
    color: 'rgba(255,255,255,0.6)',
    margin: '0 0 40px 0',
    fontStyle: 'italic',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
    border: 'none',
    color: '#fff',
    padding: '16px 48px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(233, 69, 96, 0.4)',
  },
  privacyNote: {
    marginTop: '30px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
  },

  // Sections
  section: {
    padding: '80px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionAlt: {
    background: 'rgba(255,255,255,0.02)',
    maxWidth: '100%',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '60px',
  },

  // Steps
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '30px',
  },
  step: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '30px',
    textAlign: 'center',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#e94560',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  stepIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.6',
  },

  // Problem Grid
  problemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 60px auto',
  },
  problemCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  problemIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '15px',
  },
  solution: {
    background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
    border: '1px solid rgba(233, 69, 96, 0.3)',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  solutionTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#e94560',
  },
  solutionDesc: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.8',
  },

  // Privacy Grid
  privacyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  privacyItem: {
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
  },
  checkmark: {
    background: '#10b981',
    color: '#fff',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontWeight: 'bold',
  },

  // CTA Section
  ctaSection: {
    textAlign: 'center',
    padding: '100px 40px',
    background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
  },
  ctaTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  ctaDesc: {
    fontSize: '20px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '40px',
  },
  ctaButtonLarge: {
    background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
    border: 'none',
    color: '#fff',
    padding: '20px 60px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 30px rgba(233, 69, 96, 0.5)',
  },

  // Footer
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '40px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '18px',
    marginBottom: '20px',
  },
  footerLinks: {
    marginBottom: '20px',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
  },
  footerDivider: {
    margin: '0 15px',
    color: 'rgba(255,255,255,0.3)',
  },
  footerNote: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
};

export default Landing;
