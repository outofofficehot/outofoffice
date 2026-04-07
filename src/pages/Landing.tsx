import React from 'react';
import { brand, copy } from '../brand';
import { InterestedTeaser } from '../components/EmptyStates';
import './Landing.css';

interface LandingProps {
  onLaunchApp: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLaunchApp }) => {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <img src="/assets/logo.png" alt="OOO" className="nav-logo" />
        </nav>

        <div className="hero">
          <img src="/assets/logo.png" alt="Out Of Office" className="hero-logo" />
          <p className="tagline">{copy.hero.tagline}</p>
          <p className="subline">{copy.hero.subline}</p>
          
          {/* Desktop CTA - hidden on mobile */}
          <button onClick={onLaunchApp} className="hero-cta desktop-only">
            {copy.cta.primary}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="landing-main">
        <div className="landing-content">
          {/* Left column on desktop */}
          <div className="landing-left">
            {/* Teaser card */}
            <section className="section">
              <InterestedTeaser onSignUp={onLaunchApp} />
            </section>

            {/* How it works */}
            <section className="section">
              <h2 className="section-title">{copy.howItWorks.title}</h2>
              <div className="steps">
                {copy.howItWorks.steps.map((step, i) => (
                  <div key={i} className="step">
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column on desktop */}
          <div className="landing-right">
            {/* Trust points */}
            <section className="section">
              <div className="trust-card">
                <h3 className="trust-title">{copy.trust.title}</h3>
                <ul className="trust-list">
                  {copy.trust.points.map((point, i) => (
                    <li key={i} className="trust-item">
                      <span className="checkmark">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Features grid */}
            <section className="section">
              <h2 className="section-title">{copy.features.title}</h2>
              <div className="features-grid">
                {copy.features.items.map((item, i) => (
                  <div key={i} className="feature-card">
                    <h3 className="feature-title">{item.title}</h3>
                    <p className="feature-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Sticky footer - mobile only */}
      <footer className="landing-footer mobile-only">
        <button onClick={onLaunchApp} className="cta-button">
          {copy.cta.primary}
        </button>
        <p className="footer-note">🔒 End-to-end encrypted</p>
      </footer>
    </div>
  );
};

export default Landing;
