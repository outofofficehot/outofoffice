import React from 'react';
import { brand } from '../brand';

interface EmptyStateProps {
  type: 'no-signals' | 'no-matches' | 'not-connected';
  onAction?: () => void;
  actionLabel?: string;
}

const content = {
  'no-signals': {
    emoji: '💭',
    title: 'No signals yet',
    message: "Take the leap. Signal someone you're curious about — they'll never know unless they feel the same way.",
    hint: "The worst that can happen? Nothing.",
  },
  'no-matches': {
    emoji: '✨',
    title: 'No matches yet',
    message: "Your signals are out there, working their magic. When someone you've signaled signals you back, you'll both find out here.",
    hint: "Good things take time.",
  },
  'not-connected': {
    emoji: '🔗',
    title: 'Connect to get started',
    message: "Link your LinkedIn to start signaling. We only use it to verify your identity — nothing else.",
    hint: "Your secrets are safe with cryptography.",
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, actionLabel }) => {
  const { emoji, title, message, hint } = content[type];

  return (
    <div style={styles.container}>
      <div style={styles.emojiContainer}>
        <span style={styles.emoji}>{emoji}</span>
        <div style={styles.emojiGlow} />
      </div>
      
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>
      
      {onAction && actionLabel && (
        <button onClick={onAction} style={styles.button}>
          {actionLabel}
        </button>
      )}
      
      <p style={styles.hint}>{hint}</p>
    </div>
  );
};

// Teaser for "who's interested" hook
interface InterestedTeaserProps {
  count?: number;
  onSignUp: () => void;
}

export const InterestedTeaser: React.FC<InterestedTeaserProps> = ({ count = 0, onSignUp }) => {
  const hasSignals = count > 0;

  return (
    <div style={styles.teaserContainer}>
      <div style={styles.teaserGlow} />
      
      <div style={styles.teaserContent}>
        {hasSignals ? (
          <>
            <div style={styles.teaserBadge}>
              <span style={styles.teaserCount}>{count}</span>
            </div>
            <h3 style={styles.teaserTitle}>
              {count === 1 ? 'Someone is' : `${count} people are`} interested in you
            </h3>
            <p style={styles.teaserMessage}>
              Signal them back to find out who. If it's mutual, you'll both know.
            </p>
          </>
        ) : (
          <>
            <div style={styles.teaserIcon}>👀</div>
            <h3 style={styles.teaserTitle}>
              Is someone interested in you?
            </h3>
            <p style={styles.teaserMessage}>
              Signal the people you're curious about. If any of them already signaled you, you'll match instantly.
            </p>
          </>
        )}
        
        <button onClick={onSignUp} style={styles.teaserButton}>
          {hasSignals ? 'Find out who' : 'Start signaling'}
        </button>
      </div>
    </div>
  );
};

// Activity hint (keeps users engaged without revealing info)
interface ActivityHintProps {
  activeSignals: number;
  daysUntilWithdraw?: number;
}

export const ActivityHint: React.FC<ActivityHintProps> = ({ activeSignals, daysUntilWithdraw }) => {
  if (activeSignals === 0) return null;

  return (
    <div style={styles.hintContainer}>
      <div style={styles.hintDot} />
      <span style={styles.hintText}>
        {activeSignals} active {activeSignals === 1 ? 'signal' : 'signals'}
        {daysUntilWithdraw && daysUntilWithdraw <= 7 && (
          <span style={styles.hintSecondary}>
            {' '}• {daysUntilWithdraw}d until you can withdraw
          </span>
        )}
      </span>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // Empty State
  container: {
    textAlign: 'center',
    padding: `${brand.spacing.xxl} ${brand.spacing.lg}`,
  },
  emojiContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: brand.spacing.lg,
  },
  emoji: {
    fontSize: '48px',
    position: 'relative',
    zIndex: 1,
  },
  emojiGlow: {
    position: 'absolute',
    inset: '-20px',
    background: `radial-gradient(circle, ${brand.colors.pinkDark} 0%, transparent 70%)`,
    borderRadius: '50%',
    opacity: 0.5,
  },
  title: {
    fontFamily: brand.fonts.display,
    fontSize: '20px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.sm} 0`,
    fontWeight: 400,
  },
  message: {
    fontSize: '15px',
    color: brand.colors.textSecondary,
    lineHeight: 1.6,
    margin: `0 0 ${brand.spacing.lg} 0`,
    maxWidth: '280px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    padding: `${brand.spacing.md} ${brand.spacing.xl}`,
    background: brand.gradients.button,
    color: 'white',
    border: 'none',
    borderRadius: brand.borderRadius.full,
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
    marginBottom: brand.spacing.md,
    boxShadow: brand.shadows.glow,
  },
  hint: {
    fontSize: '13px',
    color: brand.colors.textMuted,
    fontStyle: 'italic',
    margin: 0,
  },

  // Teaser
  teaserContainer: {
    position: 'relative',
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.xl,
    overflow: 'hidden',
    boxShadow: brand.shadows.card,
  },
  teaserGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle at 30% 30%, ${brand.colors.pinkDark}40 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
  teaserContent: {
    position: 'relative',
    textAlign: 'center',
  },
  teaserBadge: {
    width: '56px',
    height: '56px',
    background: brand.colors.rust,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: brand.spacing.md,
    boxShadow: `0 4px 20px ${brand.colors.rust}50`,
  },
  teaserCount: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 700,
  },
  teaserIcon: {
    fontSize: '40px',
    marginBottom: brand.spacing.md,
  },
  teaserTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '22px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.sm} 0`,
    fontWeight: 400,
  },
  teaserMessage: {
    fontSize: '15px',
    color: brand.colors.textSecondary,
    lineHeight: 1.6,
    margin: `0 0 ${brand.spacing.lg} 0`,
  },
  teaserButton: {
    padding: `${brand.spacing.md} ${brand.spacing.xxl}`,
    background: brand.gradients.button,
    color: 'white',
    border: 'none',
    borderRadius: brand.borderRadius.full,
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
    boxShadow: brand.shadows.glow,
  },

  // Activity Hint
  hintContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.sm,
    padding: `${brand.spacing.sm} ${brand.spacing.md}`,
    background: brand.colors.pinkLight,
    borderRadius: brand.borderRadius.full,
    marginBottom: brand.spacing.md,
  },
  hintDot: {
    width: '8px',
    height: '8px',
    background: brand.colors.rust,
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  hintText: {
    fontSize: '13px',
    color: brand.colors.textSecondary,
  },
  hintSecondary: {
    color: brand.colors.textMuted,
  },
};
