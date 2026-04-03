import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import { useAztec } from './hooks/useAztec';
import { useLinkedIn, LinkedInConnection } from './hooks/useLinkedIn';
import { LinkedInButton } from './components/LinkedInButton';
import { ConnectionSearch } from './components/ConnectionSearch';
import { extractLinkedInId, isValidLinkedIn } from './utils/linkedin';
import { brand, copy } from './brand';

// Check if we should show app directly
const shouldShowApp = () => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash;
  const search = window.location.search;
  // Show app if: hash is #app, OR we have an OAuth callback code
  return hash === '#app' || search.includes('code=') || localStorage.getItem('ooo_visited') === 'true';
};

function App() {
  const [showApp, setShowApp] = useState(shouldShowApp);
  
  const handleLaunchApp = () => {
    localStorage.setItem('ooo_visited', 'true');
    window.location.hash = 'app';
    setShowApp(true);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setShowApp(window.location.hash === '#app');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!showApp) {
    return <Landing onLaunchApp={handleLaunchApp} />;
  }

  return <MainApp onBackToLanding={() => { window.location.hash = ''; setShowApp(false); }} />;
}

// ============================================
// Main Application
// ============================================

interface MainAppProps {
  onBackToLanding: () => void;
}

function MainApp({ onBackToLanding }: MainAppProps) {
  // Aztec wallet
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

  // LinkedIn OAuth
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

  const [selectedTarget, setSelectedTarget] = useState<LinkedInConnection | string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [tab, setTab] = useState<'signal' | 'matches' | 'history'>('signal');

  // Auto-connect wallet
  useEffect(() => {
    connectWallet('sandbox');
  }, [connectWallet]);

  const handleSignal = async () => {
    if (!isLinkedInConnected || !linkedInProfile) {
      setStatus({ type: 'error', message: 'Connect your LinkedIn first' });
      return;
    }

    if (!selectedTarget) {
      setStatus({ type: 'error', message: 'Select someone to signal' });
      return;
    }

    // Get the target ID
    let theirId: string;
    if (typeof selectedTarget === 'string') {
      // URL or username entered manually
      const extracted = extractLinkedInId(selectedTarget);
      if (!extracted && !isValidLinkedIn(selectedTarget)) {
        setStatus({ type: 'error', message: 'Enter a valid LinkedIn URL' });
        return;
      }
      theirId = extracted || selectedTarget;
    } else {
      // Selected from dropdown
      theirId = selectedTarget.id;
    }

    try {
      setStatus({ type: 'info', message: 'Encrypting your signal...' });
      const txHash = await signalInterest(linkedInProfile.id, theirId);
      setStatus({ type: 'success', message: `Signal sent privately. TX: ${txHash.slice(0, 12)}...` });
      setSelectedTarget(null);
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to signal' });
    }
  };

  const handleTargetSelect = (target: LinkedInConnection | string) => {
    setSelectedTarget(target);
  };

  const clearTarget = () => {
    setSelectedTarget(null);
  };

  const handleCheckMatch = async (theirHash: string) => {
    if (!linkedInProfile) return;
    
    try {
      setStatus({ type: 'info', message: 'Checking for mutual interest...' });
      const isMatch = await checkMutual(linkedInProfile.id, theirHash);
      if (isMatch) {
        setStatus({ type: 'success', message: 'It\'s mutual! You both signaled each other.' });
      } else {
        setStatus({ type: 'info', message: 'No mutual match yet.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Check failed' });
    }
  };

  // Combined loading/error state
  const isLoading = isWalletLoading || isLinkedInLoading;
  const error = walletError || linkedInError;

  // Not fully connected state
  if (!isWalletConnected) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBackToLanding} style={styles.backButton}>← Back</button>
          <img src="/assets/logo.png" alt="OOO" style={styles.headerLogo} />
        </header>

        <div style={styles.card}>
          <div style={styles.alertInfo}>
            🔒 Connect your wallet to signal privately
          </div>

          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={() => connectWallet('sandbox')}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : copy.cta.connect}
          </button>

          {error && (
            <div style={styles.alertError}>{error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBackToLanding} style={styles.backButton}>← Back</button>
        <img src="/assets/logo.png" alt="OOO" style={styles.headerLogo} />
        <p style={styles.headerStatus}>
          {myMatches.length} matches • {mySignals.length} signals
        </p>
      </header>

      {/* Tabs */}
      <div style={styles.tabs}>
        {(['signal', 'matches', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.tab,
              ...(tab === t ? styles.tabActive : {}),
            }}
          >
            {t === 'signal' && 'Signal'}
            {t === 'matches' && 'Matches'}
            {t === 'history' && 'History'}
          </button>
        ))}
      </div>

      {/* Status */}
      {status && (
        <div style={{
          ...styles.alert,
          ...(status.type === 'success' ? styles.alertSuccess : 
              status.type === 'error' ? styles.alertError : styles.alertInfo),
        }}>
          {status.message}
        </div>
      )}

      {/* Signal Tab */}
      {tab === 'signal' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Signal interest</h2>
          
          {/* LinkedIn Connection */}
          <LinkedInButton
            profile={linkedInProfile}
            isLoading={isLinkedInLoading}
            onConnect={connectLinkedIn}
            onDisconnect={disconnectLinkedIn}
          />

          {/* Target Selection */}
          <label style={styles.label}>Who are you interested in?</label>
          
          {selectedTarget ? (
            <div style={styles.selectedTarget}>
              <div style={styles.selectedTargetInfo}>
                {typeof selectedTarget === 'string' ? (
                  <span style={styles.selectedTargetName}>{selectedTarget}</span>
                ) : (
                  <>
                    {selectedTarget.picture && (
                      <img src={selectedTarget.picture} alt="" style={styles.selectedTargetAvatar} />
                    )}
                    <span style={styles.selectedTargetName}>
                      {selectedTarget.firstName} {selectedTarget.lastName}
                    </span>
                  </>
                )}
              </div>
              <button onClick={clearTarget} style={styles.clearButton}>×</button>
            </div>
          ) : (
            <ConnectionSearch
              onSelect={handleTargetSelect}
              searchConnections={searchConnections}
              connectionsAvailable={connectionsAvailable}
              placeholder={connectionsAvailable ? "Search connections or paste LinkedIn URL" : "Paste LinkedIn URL"}
            />
          )}

          <button
            onClick={handleSignal}
            style={{
              ...styles.button,
              ...styles.buttonPrimary,
              ...(!isLinkedInConnected || !selectedTarget ? styles.buttonDisabled : {}),
            }}
            disabled={!isLinkedInConnected || !selectedTarget || isLoading}
          >
            Signal Interest • $10 stake
          </button>

          <p style={styles.cardNote}>
            Your signal is encrypted. They won't know unless it's mutual.
          </p>
        </div>
      )}

      {/* Matches Tab */}
      {tab === 'matches' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your matches</h2>
          
          {myMatches.length === 0 ? (
            <p style={styles.emptyState}>
              No matches yet. When someone you've signaled signals you back, you'll both find out here.
            </p>
          ) : (
            <ul style={styles.list}>
              {myMatches.map((match, i) => (
                <li key={i} style={styles.listItem}>
                  <span>Profile: {match.theirLinkedInHash.slice(0, 12)}...</span>
                  <span style={styles.matchBadge}>Mutual ✓</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your signals</h2>
          
          {mySignals.length === 0 ? (
            <p style={styles.emptyState}>
              No signals yet. Start by signaling someone.
            </p>
          ) : (
            <ul style={styles.list}>
              {mySignals.map((signal, i) => (
                <li key={i} style={styles.listItem}>
                  <div>
                    <div style={styles.listItemTitle}>
                      {signal.toLinkedInHash.slice(0, 16)}...
                    </div>
                    <div style={styles.listItemDate}>
                      {new Date(signal.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckMatch(signal.toLinkedInHash)}
                    style={styles.buttonSmall}
                  >
                    Check
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Info Card */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>How it works</h3>
        <ol style={styles.infoList}>
          <li>Connect your LinkedIn</li>
          <li>Enter their profile URL</li>
          <li>Stake $10 to signal</li>
          <li>If mutual → both notified</li>
          <li>If not → nobody knows</li>
        </ol>
      </div>
    </div>
  );
}

// ============================================
// Styles
// ============================================

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: brand.colors.base,
    padding: brand.spacing.xl,
    fontFamily: brand.fonts.body,
    maxWidth: '500px',
    margin: '0 auto',
  },
  
  // Header
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: brand.spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    background: 'transparent',
    border: `1px solid ${brand.colors.rust}`,
    color: brand.colors.rust,
    padding: `${brand.spacing.xs} ${brand.spacing.md}`,
    borderRadius: brand.borderRadius.full,
    fontSize: '14px',
    cursor: 'pointer',
  },
  headerLogo: {
    height: '80px',
    width: 'auto',
    marginBottom: brand.spacing.sm,
  },
  headerStatus: {
    fontSize: '14px',
    color: brand.colors.textMuted,
    margin: 0,
  },

  // Tabs
  tabs: {
    display: 'flex',
    gap: brand.spacing.sm,
    marginBottom: brand.spacing.lg,
  },
  tab: {
    flex: 1,
    padding: brand.spacing.md,
    background: brand.colors.white,
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.md,
    fontFamily: brand.fonts.body,
    fontWeight: 500,
    fontSize: '14px',
    color: brand.colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: brand.colors.rust,
    borderColor: brand.colors.rust,
    color: brand.colors.white,
  },

  // Alerts
  alert: {
    padding: brand.spacing.md,
    borderRadius: brand.borderRadius.md,
    marginBottom: brand.spacing.lg,
    fontSize: '14px',
  },
  alertInfo: {
    background: brand.colors.pinkLight,
    border: `1px solid ${brand.colors.pinkDark}`,
    color: brand.colors.textPrimary,
    padding: brand.spacing.md,
    borderRadius: brand.borderRadius.md,
    marginBottom: brand.spacing.lg,
    fontSize: '14px',
  },
  alertSuccess: {
    background: '#E8F5E9',
    border: '1px solid #C8E6C9',
    color: '#2E7D32',
  },
  alertError: {
    background: '#FFEBEE',
    border: '1px solid #FFCDD2',
    color: brand.colors.rust,
    padding: brand.spacing.md,
    borderRadius: brand.borderRadius.md,
    marginTop: brand.spacing.md,
    fontSize: '14px',
  },

  // Card
  card: {
    background: brand.colors.white,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.xl,
    marginBottom: brand.spacing.lg,
    boxShadow: brand.shadows.card,
  },
  cardTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '22px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.lg} 0`,
    fontWeight: 400,
  },
  cardNote: {
    fontSize: '13px',
    color: brand.colors.textMuted,
    textAlign: 'center',
    marginTop: brand.spacing.md,
    marginBottom: 0,
  },

  // Label
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: brand.colors.textPrimary,
    marginBottom: brand.spacing.sm,
  },

  // Input
  input: {
    width: '100%',
    padding: brand.spacing.md,
    fontSize: '16px',
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.md,
    marginBottom: brand.spacing.md,
    boxSizing: 'border-box',
    fontFamily: brand.fonts.body,
    background: brand.colors.pinkLight,
    color: brand.colors.textPrimary,
    outline: 'none',
  },

  // Buttons
  button: {
    width: '100%',
    padding: brand.spacing.md,
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: brand.borderRadius.full,
    cursor: 'pointer',
    fontFamily: brand.fonts.body,
    transition: 'all 0.2s ease',
  },
  buttonPrimary: {
    background: brand.gradients.button,
    color: brand.colors.white,
    boxShadow: brand.shadows.glow,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  buttonSmall: {
    padding: `${brand.spacing.xs} ${brand.spacing.md}`,
    fontSize: '13px',
    fontWeight: 500,
    border: `1px solid ${brand.colors.rust}`,
    borderRadius: brand.borderRadius.full,
    background: 'transparent',
    color: brand.colors.rust,
    cursor: 'pointer',
    fontFamily: brand.fonts.body,
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
    padding: brand.spacing.md,
    borderBottom: `1px solid ${brand.colors.pinkDark}`,
  },
  listItemTitle: {
    fontSize: '14px',
    color: brand.colors.textPrimary,
    fontFamily: 'monospace',
  },
  listItemDate: {
    fontSize: '12px',
    color: brand.colors.textMuted,
  },
  matchBadge: {
    background: brand.colors.rust,
    color: brand.colors.white,
    padding: `${brand.spacing.xs} ${brand.spacing.md}`,
    borderRadius: brand.borderRadius.full,
    fontSize: '12px',
    fontWeight: 600,
  },
  emptyState: {
    color: brand.colors.textMuted,
    textAlign: 'center',
    padding: brand.spacing.lg,
    fontSize: '14px',
    lineHeight: 1.6,
  },

  // Info Card
  infoCard: {
    background: brand.colors.pinkLight,
    borderRadius: brand.borderRadius.lg,
    padding: brand.spacing.lg,
    border: `1px solid ${brand.colors.pinkDark}`,
  },
  infoTitle: {
    fontFamily: brand.fonts.display,
    fontSize: '16px',
    color: brand.colors.textPrimary,
    margin: `0 0 ${brand.spacing.md} 0`,
    fontWeight: 400,
  },
  infoList: {
    margin: 0,
    paddingLeft: brand.spacing.lg,
    color: brand.colors.textSecondary,
    fontSize: '14px',
    lineHeight: 1.8,
  },

  // Selected Target
  selectedTarget: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brand.spacing.md,
    background: brand.colors.pinkLight,
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.md,
    marginBottom: brand.spacing.md,
  },
  selectedTargetInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.sm,
  },
  selectedTargetAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: brand.borderRadius.full,
    objectFit: 'cover',
  },
  selectedTargetName: {
    fontWeight: 500,
    color: brand.colors.textPrimary,
    fontSize: '14px',
  },
  clearButton: {
    width: '28px',
    height: '28px',
    background: 'transparent',
    border: `1px solid ${brand.colors.textMuted}`,
    borderRadius: brand.borderRadius.full,
    color: brand.colors.textMuted,
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 1,
  },
};

export default App;
