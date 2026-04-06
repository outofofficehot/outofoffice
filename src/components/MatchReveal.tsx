import React, { useEffect, useState } from 'react';
import { brand } from '../brand';

interface MatchRevealProps {
  match: {
    firstName: string;
    lastName: string;
    picture?: string;
    profileUrl: string;
  };
  onClose: () => void;
  onMessage: () => void;
}

export const MatchReveal: React.FC<MatchRevealProps> = ({ match, onClose, onMessage }) => {
  const [stage, setStage] = useState<'build' | 'reveal' | 'shown'>('build');
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Generate confetti
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: [brand.colors.rust, brand.colors.gold, brand.colors.pinkDark, '#fff'][Math.floor(Math.random() * 4)],
    }));
    setConfetti(particles);

    // Animation sequence
    const timer1 = setTimeout(() => setStage('reveal'), 800);
    const timer2 = setTimeout(() => setStage('shown'), 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div style={styles.overlay}>
      {/* Confetti */}
      {stage !== 'build' && confetti.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.confetti,
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
          }}
        />
      ))}

      <div style={{
        ...styles.content,
        ...(stage === 'build' ? styles.contentBuild : {}),
        ...(stage === 'reveal' ? styles.contentReveal : {}),
        ...(stage === 'shown' ? styles.contentShown : {}),
      }}>
        {/* Build-up text */}
        {stage === 'build' && (
          <div style={styles.buildUp}>
            <span style={styles.buildUpText}>It's mutual...</span>
          </div>
        )}

        {/* Reveal */}
        {(stage === 'reveal' || stage === 'shown') && (
          <>
            <div style={styles.matchIcon}>💕</div>
            
            <h1 style={styles.title}>It's a match!</h1>
            
            <div style={styles.profileCard}>
              {match.picture ? (
                <img src={match.picture} alt="" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {match.firstName.charAt(0)}{match.lastName.charAt(0)}
                </div>
              )}
              <h2 style={styles.name}>{match.firstName} {match.lastName}</h2>
              <p style={styles.subtitle}>also signaled interest in you</p>
            </div>

            {stage === 'shown' && (
              <div style={styles.actions}>
                <button onClick={onMessage} style={styles.primaryButton}>
                  Message on LinkedIn
                </button>
                <button onClick={onClose} style={styles.secondaryButton}>
                  Keep browsing
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Close button */}
      {stage === 'shown' && (
        <button onClick={onClose} style={styles.closeButton}>×</button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: `linear-gradient(135deg, ${brand.colors.rust} 0%, #8B2A1A 100%)`,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '2px',
    top: '-20px',
    animation: 'confetti-fall 3s ease-out forwards',
  },
  content: {
    textAlign: 'center',
    padding: brand.spacing.xl,
    transition: 'all 0.5s ease',
  },
  contentBuild: {
    transform: 'scale(0.9)',
    opacity: 0.8,
  },
  contentReveal: {
    transform: 'scale(1.1)',
    opacity: 1,
  },
  contentShown: {
    transform: 'scale(1)',
    opacity: 1,
  },
  buildUp: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  buildUpText: {
    fontFamily: brand.fonts.display,
    fontSize: '32px',
    color: 'white',
    opacity: 0.9,
    animation: 'pulse 0.8s ease-in-out infinite',
  },
  matchIcon: {
    fontSize: '64px',
    marginBottom: brand.spacing.md,
    animation: 'bounce 0.6s ease',
  },
  title: {
    fontFamily: brand.fonts.display,
    fontSize: 'clamp(32px, 8vw, 48px)',
    color: 'white',
    margin: `0 0 ${brand.spacing.xl} 0`,
    fontWeight: 400,
  },
  profileCard: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: brand.borderRadius.xl,
    padding: brand.spacing.xl,
    marginBottom: brand.spacing.xl,
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid white',
    marginBottom: brand.spacing.md,
  },
  avatarPlaceholder: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 600,
    margin: '0 auto',
    marginBottom: brand.spacing.md,
  },
  name: {
    fontFamily: brand.fonts.display,
    fontSize: '28px',
    color: 'white',
    margin: `0 0 ${brand.spacing.xs} 0`,
    fontWeight: 400,
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: brand.spacing.md,
    maxWidth: '300px',
    margin: '0 auto',
  },
  primaryButton: {
    padding: `${brand.spacing.md} ${brand.spacing.xl}`,
    background: 'white',
    color: brand.colors.rust,
    border: 'none',
    borderRadius: brand.borderRadius.full,
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  secondaryButton: {
    padding: `${brand.spacing.md} ${brand.spacing.xl}`,
    background: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.5)',
    borderRadius: brand.borderRadius.full,
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '44px',
    height: '44px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Add keyframes via style injection
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `;
  document.head.appendChild(styleSheet);
}
