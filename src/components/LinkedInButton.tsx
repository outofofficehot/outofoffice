import React from 'react';
import { brand } from '../brand';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  picture?: string;
}

interface LinkedInButtonProps {
  profile: LinkedInProfile | null;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const LinkedInButton: React.FC<LinkedInButtonProps> = ({
  profile,
  isLoading,
  onConnect,
  onDisconnect,
}) => {
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Connecting to LinkedIn...</div>
      </div>
    );
  }

  if (profile) {
    return (
      <div style={styles.container}>
        <div style={styles.profile}>
          {profile.picture && (
            <img src={profile.picture} alt="" style={styles.avatar} />
          )}
          <div style={styles.profileInfo}>
            <span style={styles.name}>
              {profile.firstName} {profile.lastName}
            </span>
            <span style={styles.connected}>Connected via LinkedIn</span>
          </div>
          <button onClick={onDisconnect} style={styles.disconnectBtn}>
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={onConnect} style={styles.connectBtn}>
        <LinkedInIcon />
        <span>Connect with LinkedIn</span>
      </button>
      <p style={styles.note}>
        We only access your name and profile ID. Nothing else.
      </p>
    </div>
  );
};

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: brand.spacing.lg,
  },
  connectBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: brand.spacing.sm,
    padding: brand.spacing.md,
    background: '#0A66C2',
    color: 'white',
    border: 'none',
    borderRadius: brand.borderRadius.md,
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: brand.fonts.body,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.md,
    padding: brand.spacing.md,
    background: brand.colors.pinkLight,
    borderRadius: brand.borderRadius.md,
    border: `1px solid ${brand.colors.pinkDark}`,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: brand.borderRadius.full,
    objectFit: 'cover',
  },
  profileInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: 600,
    fontSize: '14px',
    color: brand.colors.textPrimary,
  },
  connected: {
    fontSize: '12px',
    color: brand.colors.textMuted,
  },
  disconnectBtn: {
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
  loading: {
    padding: brand.spacing.md,
    textAlign: 'center',
    color: brand.colors.textMuted,
    fontSize: '14px',
  },
  note: {
    fontSize: '12px',
    color: brand.colors.textMuted,
    textAlign: 'center',
    marginTop: brand.spacing.sm,
    marginBottom: 0,
  },
};
