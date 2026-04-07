import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import { MatchReveal } from './components/MatchReveal';
import { EmptyState } from './components/EmptyStates';
import { useAztec } from './hooks/useAztec';
import { useLinkedIn, LinkedInConnection } from './hooks/useLinkedIn';
import { LinkedInButton } from './components/LinkedInButton';
import { ConnectionSearch } from './components/ConnectionSearch';
import { extractLinkedInId, isValidLinkedIn } from './utils/linkedin';
import { brand } from './brand';

function App() {
  const [showApp, setShowApp] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Only show app if explicitly on #app or handling OAuth callback
    return window.location.hash === '#app' || 
           window.location.search.includes('code=');
  });
  
  const handleLaunchApp = () => {
    localStorage.setItem('ooo_visited', 'true');
    window.location.hash = '#app';
    setShowApp(true);
  };

  useEffect(() => {
    const handleHashChange = () => setShowApp(window.location.hash === '#app');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!showApp) {
    return <Landing onLaunchApp={handleLaunchApp} />;
  }

  return <MainApp onBackToLanding={() => { window.location.hash = ''; setShowApp(false); }} />;
}

// ============================================
// Main App - Mobile First Design
// ============================================

interface MainAppProps {
  onBackToLanding: () => void;
}

function MainApp({ onBackToLanding }: MainAppProps) {
  const {
    isConnected: isWalletConnected,
    isLoading: isWalletLoading,
    error: walletError,
    connect: connectWallet,
    signalInterest,
    checkMutual,
    mySignals,
    myMatches,
  } = useAztec();

  const {
    profile: linkedInProfile,
    isConnected: isLinkedInConnected,
    isLoading: isLinkedInLoading,
    error: linkedInError,
    connect: connectLinkedIn,
    disconnect: disconnectLinkedIn,
    searchConnections,
    connectionsAvailable,
  } = useLinkedIn();

  const [tab, setTab] = useState<'signal' | 'matches' | 'you'>('signal');
  const [selectedTarget, setSelectedTarget] = useState<LinkedInConnection | string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showMatchReveal, setShowMatchReveal] = useState(false);
  const [revealedMatch, setRevealedMatch] = useState<any>(null);

  useEffect(() => {
    connectWallet('sandbox');
  }, [connectWallet]);

  // Handle new match - trigger reveal animation
  useEffect(() => {
    if (myMatches.length > 0) {
      const latestMatch = myMatches[myMatches.length - 1];
      // Check if this is a new match (not already revealed)
      const revealedMatches = JSON.parse(localStorage.getItem('ooo_revealed_matches') || '[]');
      if (!revealedMatches.includes(latestMatch.theirLinkedInHash)) {
        setRevealedMatch({
          firstName: 'Someone',
          lastName: 'Special',
          profileUrl: `https://linkedin.com/in/${latestMatch.theirLinkedInHash}`,
        });
        setShowMatchReveal(true);
        localStorage.setItem('ooo_revealed_matches', JSON.stringify([...revealedMatches, latestMatch.theirLinkedInHash]));
      }
    }
  }, [myMatches]);

  const handleSignal = async () => {
    if (!isLinkedInConnected || !linkedInProfile) {
      setStatus({ type: 'error', message: 'Connect your LinkedIn first' });
      return;
    }
    if (!selectedTarget) {
      setStatus({ type: 'error', message: 'Select someone to signal' });
      return;
    }

    let theirId: string;
    if (typeof selectedTarget === 'string') {
      const extracted = extractLinkedInId(selectedTarget);
      if (!extracted && !isValidLinkedIn(selectedTarget)) {
        setStatus({ type: 'error', message: 'Enter a valid LinkedIn URL' });
        return;
      }
      theirId = extracted || selectedTarget;
    } else {
      theirId = selectedTarget.id;
    }

    try {
      setStatus({ type: 'info', message: 'Encrypting your signal...' });
      const txHash = await signalInterest(linkedInProfile.id, theirId);
      setStatus({ type: 'success', message: 'Signal sent! 🔒' });
      setSelectedTarget(null);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed' });
    }
  };

  const handleCheckMatch = async (theirHash: string) => {
    if (!linkedInProfile) return;
    try {
      setStatus({ type: 'info', message: 'Checking...' });
      const isMatch = await checkMutual(linkedInProfile.id, theirHash);
      if (isMatch) {
        setStatus({ type: 'success', message: "It's mutual! 💕" });
      } else {
        setStatus({ type: 'info', message: 'No match yet' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Check failed' });
    }
  };

  const isLoading = isWalletLoading || isLinkedInLoading;
  const error = walletError || linkedInError;

  // Match reveal overlay
  if (showMatchReveal && revealedMatch) {
    return (
      <MatchReveal
        match={revealedMatch}
        onClose={() => setShowMatchReveal(false)}
        onMessage={() => {
          window.open(revealedMatch.profileUrl, '_blank');
          setShowMatchReveal(false);
        }}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={onBackToLanding} style={styles.backBtn}>←</button>
        <img src="/assets/logo.png" alt="OOO" style={styles.logo} />
        <div style={styles.headerSpacer} />
      </header>

      {/* Status toast */}
      {status && (
        <div style={{
          ...styles.toast,
          background: status.type === 'success' ? '#E8F5E9' : 
                      status.type === 'error' ? '#FFEBEE' : brand.colors.pinkLight,
          color: status.type === 'success' ? '#2E7D32' : 
                 status.type === 'error' ? brand.colors.rust : brand.colors.textPrimary,
        }}>
          {status.message}
          <button onClick={() => setStatus(null)} style={styles.toastClose}>×</button>
        </div>
      )}

      {/* Main content */}
      <main style={styles.main}>
        {/* Signal Tab */}
        {tab === 'signal' && (
          <div style={styles.tabContent}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Signal someone</h2>
              
              <LinkedInButton
                profile={linkedInProfile}
                isLoading={isLinkedInLoading}
                onConnect={connectLinkedIn}
                onDisconnect={disconnectLinkedIn}
              />

              {isLinkedInConnected && (
                <>
                  <label style={styles.label}>Who are you interested in?</label>
                  
                  {selectedTarget ? (
                    <div style={styles.selectedTarget}>
                      <span style={styles.selectedName}>
                        {typeof selectedTarget === 'string' 
                          ? selectedTarget 
                          : `${selectedTarget.firstName} ${selectedTarget.lastName}`}
                      </span>
                      <button onClick={() => setSelectedTarget(null)} style={styles.clearBtn}>×</button>
                    </div>
                  ) : (
                    <ConnectionSearch
                      onSelect={setSelectedTarget}
                      searchConnections={searchConnections}
                      connectionsAvailable={connectionsAvailable}
                      placeholder="Paste LinkedIn URL"
                    />
                  )}

                  <button
                    onClick={handleSignal}
                    disabled={!selectedTarget || isLoading}
                    style={{
                      ...styles.primaryBtn,
                      ...(!selectedTarget ? styles.btnDisabled : {}),
                    }}
                  >
                    Signal Interest • $10
                  </button>
                </>
              )}
            </div>

            <p style={styles.hint}>
              They'll never know unless they signal you back.
            </p>
          </div>
        )}

        {/* Matches Tab */}
        {tab === 'matches' && (
          <div style={styles.tabContent}>
            {myMatches.length === 0 ? (
              <EmptyState
                type="no-matches"
                onAction={() => setTab('signal')}
                actionLabel="Signal someone"
              />
            ) : (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Your matches</h2>
                <ul style={styles.list}>
                  {myMatches.map((match, i) => (
                    <li key={i} style={styles.listItem}>
                      <span style={styles.listText}>{match.theirLinkedInHash.slice(0, 12)}...</span>
                      <span style={styles.matchBadge}>Match! 💕</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* You Tab (History + Profile) */}
        {tab === 'you' && (
          <div style={styles.tabContent}>
            {mySignals.length === 0 ? (
              <EmptyState
                type="no-signals"
                onAction={() => setTab('signal')}
                actionLabel="Send your first signal"
              />
            ) : (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Your signals</h2>
                <ul style={styles.list}>
                  {mySignals.map((signal, i) => (
                    <li key={i} style={styles.listItem}>
                      <div>
                        <div style={styles.listText}>{signal.toLinkedInHash.slice(0, 16)}...</div>
                        <div style={styles.listDate}>
                          {new Date(signal.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <button onClick={() => handleCheckMatch(signal.toLinkedInHash)} style={styles.smallBtn}>
                        Check
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation - Mobile Pattern */}
      <nav style={styles.bottomNav}>
        <button 
          onClick={() => setTab('signal')} 
          style={{...styles.navItem, ...(tab === 'signal' ? styles.navItemActive : {})}}
        >
          <span style={styles.navIcon}>💫</span>
          <span style={styles.navLabel}>Signal</span>
        </button>
        <button 
          onClick={() => setTab('matches')} 
          style={{...styles.navItem, ...(tab === 'matches' ? styles.navItemActive : {})}}
        >
          <span style={styles.navIcon}>💕</span>
          <span style={styles.navLabel}>Matches</span>
          {myMatches.length > 0 && <span style={styles.navBadge}>{myMatches.length}</span>}
        </button>
        <button 
          onClick={() => setTab('you')} 
          style={{...styles.navItem, ...(tab === 'you' ? styles.navItemActive : {})}}
        >
          <span style={styles.navIcon}>👤</span>
          <span style={styles.navLabel}>You</span>
        </button>
      </nav>
    </div>
  );
}

// ============================================
// Mobile-First Styles
// ============================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100dvh', // Falls back to 100vh in older browsers
    display: 'flex',
    flexDirection: 'column',
    background: brand.colors.base,
    fontFamily: brand.fonts.body,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brand.spacing.md,
    paddingTop: `max(${brand.spacing.md}, env(safe-area-inset-top))`,
  },
  backBtn: {
    width: '40px',
    height: '40px',
    background: 'transparent',
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.full,
    color: brand.colors.rust,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: '36px',
    width: 'auto',
  },
  headerSpacer: {
    width: '40px',
  },

  // Toast
  toast: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: `0 ${brand.spacing.md}`,
    padding: brand.spacing.md,
    borderRadius: brand.borderRadius.md,
    fontSize: '14px',
    fontWeight: 500,
  },
  toastClose: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    opacity: 0.6,
    padding: 0,
    marginLeft: brand.spacing.sm,
  },

  // Main
  main: {
    flex: 1,
    overflow: 'auto',
    padding: brand.spacing.md,
    paddingBottom: '100px',
  },
  tabContent: {
    maxWidth: '500px',
    margin: '0 auto',
  },

  // Card
  card: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.lg,
    boxShadow: brand.shadows.card,
    marginBottom: brand.spacing.md,
  },
  cardTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '20px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.md} 0`,
    fontWeight: 400,
  },

  // Form
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: brand.colors.textPrimary,
    marginBottom: brand.spacing.sm,
    marginTop: brand.spacing.md,
  },
  selectedTarget: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brand.spacing.md,
    background: brand.colors.pinkLight,
    borderRadius: brand.borderRadius.md,
    marginBottom: brand.spacing.md,
  },
  selectedName: {
    fontWeight: 500,
    color: brand.colors.textPrimary,
    fontSize: '14px',
  },
  clearBtn: {
    width: '28px',
    height: '28px',
    background: 'transparent',
    border: `1px solid ${brand.colors.textMuted}`,
    borderRadius: '50%',
    color: brand.colors.textMuted,
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },

  // Buttons
  primaryBtn: {
    width: '100%',
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
    marginTop: brand.spacing.md,
    touchAction: 'manipulation',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  smallBtn: {
    padding: `${brand.spacing.xs} ${brand.spacing.md}`,
    background: 'transparent',
    border: `1px solid ${brand.colors.rust}`,
    borderRadius: brand.borderRadius.full,
    color: brand.colors.rust,
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },

  // List
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${brand.spacing.md} 0`,
    borderBottom: `1px solid ${brand.colors.pinkDark}`,
  },
  listText: {
    fontSize: '14px',
    color: brand.colors.textPrimary,
    fontFamily: 'monospace',
  },
  listDate: {
    fontSize: '12px',
    color: brand.colors.textMuted,
    marginTop: '2px',
  },
  matchBadge: {
    background: brand.colors.rust,
    color: 'white',
    padding: `${brand.spacing.xs} ${brand.spacing.sm}`,
    borderRadius: brand.borderRadius.full,
    fontSize: '12px',
    fontWeight: 600,
  },

  // Hint
  hint: {
    textAlign: 'center',
    fontSize: '13px',
    color: brand.colors.textMuted,
    padding: brand.spacing.md,
  },

  // Bottom Navigation
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    background: brand.colors.white,
    borderTop: `1px solid ${brand.colors.pinkDark}`,
    paddingBottom: `max(${brand.spacing.sm}, env(safe-area-inset-bottom))`,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${brand.spacing.sm} 0`,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    color: brand.colors.textMuted,
    transition: 'color 0.2s ease',
  },
  navItemActive: {
    color: brand.colors.rust,
  },
  navIcon: {
    fontSize: '20px',
    marginBottom: '2px',
  },
  navLabel: {
    fontSize: '11px',
    fontWeight: 500,
  },
  navBadge: {
    position: 'absolute',
    top: '4px',
    right: 'calc(50% - 20px)',
    background: brand.colors.rust,
    color: 'white',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '16px',
    textAlign: 'center',
  },
};

export default App;
