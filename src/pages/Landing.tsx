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
          <p className="linkedin-hint">
            <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Works with your LinkedIn network
          </p>
          
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
