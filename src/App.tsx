import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import { useAztec } from './hooks/useAztec';
import { extractLinkedInId, isValidLinkedIn } from './utils/linkedin';

// Check if we should show app directly (e.g., /app route or returning user)
const shouldShowApp = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hash === '#app' || localStorage.getItem('ooo_visited') === 'true';
};

function App() {
  const [showApp, setShowApp] = useState(shouldShowApp);
  
  const handleLaunchApp = () => {
    localStorage.setItem('ooo_visited', 'true');
    window.location.hash = 'app';
    setShowApp(true);
  };

  // Handle hash changes
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
  const {
    isConnected,
    isLoading,
    error,
    connect,
    signalInterest,
    checkMutual,
    mySignals,
    myMatches,
  } = useAztec();

  const [myLinkedIn, setMyLinkedIn] = useState('');
  const [theirLinkedIn, setTheirLinkedIn] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [tab, setTab] = useState<'signal' | 'matches' | 'history'>('signal');

  // Auto-connect for demo
  useEffect(() => {
    // Auto-connect in dev mode
    connect('sandbox');
  }, [connect]);

  const handleSignal = async () => {
    if (!isValidLinkedIn(theirLinkedIn)) {
      setStatus({ type: 'error', message: 'Please enter a valid LinkedIn profile URL or username' });
      return;
    }

    if (!myLinkedIn) {
      setStatus({ type: 'error', message: 'Please enter your LinkedIn profile first' });
      return;
    }

    try {
      setStatus({ type: 'info', message: 'Signaling interest privately...' });
      const txHash = await signalInterest(myLinkedIn, theirLinkedIn);
      setStatus({ type: 'success', message: `Interest signaled! 🔒 TX: ${txHash.slice(0, 16)}...` });
      setTheirLinkedIn('');
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to signal' });
    }
  };

  const handleCheckMatch = async (theirLinkedInId: string) => {
    try {
      setStatus({ type: 'info', message: 'Checking for mutual match...' });
      const isMatch = await checkMutual(myLinkedIn, theirLinkedInId);
      if (isMatch) {
        setStatus({ type: 'success', message: '🎉 It\'s a match! You both signaled each other!' });
      } else {
        setStatus({ type: 'info', message: 'No mutual match yet. If they signal you back, you\'ll both be notified.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to check' });
    }
  };

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBackToLanding} style={styles.backButton}>← Back</button>
          <div style={styles.logo}>🏖️</div>
          <h1 style={styles.title}>Out Of Office</h1>
          <p style={styles.subtitle}>Private mutual interest signaling</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.alert, ...styles.warning }}>
            ⚠️ <strong>Alpha Network</strong>: Running on Aztec Alpha. 
            Use test tokens only.
          </div>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => connect('sandbox')}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {error && (
            <div style={{ ...styles.alert, ...styles.error, marginTop: '16px' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBackToLanding} style={styles.backButton}>← Back</button>
        <div style={styles.logo}>🏖️</div>
        <h1 style={styles.title}>Out Of Office</h1>
        <p style={styles.subtitle}>
          Connected • {myMatches.length} matches • {mySignals.length} signals
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['signal', 'matches', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...styles.button,
              ...(tab === t ? styles.primaryButton : styles.secondaryButton),
              flex: 1,
            }}
          >
            {t === 'signal' && '🏖️ Signal'}
            {t === 'matches' && '🎉 Matches'}
            {t === 'history' && '📜 History'}
          </button>
        ))}
      </div>

      {/* Status message */}
      {status && (
        <div
          style={{
            ...styles.alert,
            ...(status.type === 'success' ? styles.success : status.type === 'error' ? styles.error : styles.warning),
          }}
        >
          {status.message}
        </div>
      )}

      {/* Signal tab */}
      {tab === 'signal' && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Signal Interest</h2>
          
          <input
            type="text"
            placeholder="Your LinkedIn (linkedin.com/in/you)"
            value={myLinkedIn}
            onChange={(e) => setMyLinkedIn(extractLinkedInId(e.target.value) || e.target.value)}
            style={styles.input}
          />
          
          <input
            type="text"
            placeholder="Their LinkedIn (linkedin.com/in/them)"
            value={theirLinkedIn}
            onChange={(e) => setTheirLinkedIn(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleSignal}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              ...(isLoading ? styles.disabledButton : {}),
            }}
            disabled={isLoading || !myLinkedIn || !theirLinkedIn}
          >
            🏖️ Signal Interest ($10 stake)
          </button>

          <p style={{ color: '#999', fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>
            Your signal is <strong>completely private</strong>. They won't know unless they signal you back.
          </p>
        </div>
      )}

      {/* Matches tab */}
      {tab === 'matches' && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>🎉 Your Matches</h2>
          
          {myMatches.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>
              No matches yet. When someone you've signaled signals you back, they'll appear here!
            </p>
          ) : (
            <ul style={styles.signalList}>
              {myMatches.map((match, i) => (
                <li key={i} style={styles.signalItem}>
                  <span>Profile: {match.theirLinkedInHash.slice(0, 12)}...</span>
                  <span style={styles.matchBadge}>MATCHED!</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>📜 Your Signals</h2>
          
          {mySignals.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>
              No signals yet. Start by signaling someone!
            </p>
          ) : (
            <ul style={styles.signalList}>
              {mySignals.map((signal, i) => (
                <li key={i} style={styles.signalItem}>
                  <div>
                    <div>To: {signal.toLinkedInHash.slice(0, 12)}...</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(signal.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckMatch(signal.toLinkedInHash)}
                    style={{ ...styles.button, ...styles.secondaryButton, width: 'auto', padding: '8px 16px' }}
                  >
                    Check Match
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* How it works */}
      <div style={{ ...styles.card, background: '#1a1a2e' }}>
        <h3 style={{ marginTop: 0 }}>How It Works</h3>
        <ol style={{ paddingLeft: '20px', color: '#999' }}>
          <li>Enter your LinkedIn and theirs</li>
          <li>Stake $10 to signal interest</li>
          <li>Your signal is <strong>encrypted</strong> — they can't see it</li>
          <li>If they signal you back → <strong>both notified</strong></li>
          <li>If not → <strong>nobody knows</strong> (withdraw stake after 30 days)</li>
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    top: '20px',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logo: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#fff',
  },
  subtitle: {
    color: '#999',
    fontSize: '16px',
  },
  card: {
    background: '#16213e',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
    color: 'white',
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
  },
  disabledButton: {
    background: '#555',
    cursor: 'not-allowed',
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  warning: {
    background: 'rgba(255, 193, 7, 0.1)',
    border: '1px solid rgba(255, 193, 7, 0.3)',
    color: '#ffc107',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
  },
  signalList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  signalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
  },
  matchBadge: {
    background: '#e94560',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default App;
