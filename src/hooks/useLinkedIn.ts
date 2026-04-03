// LinkedIn OAuth hook for Out Of Office
import { useState, useEffect, useCallback } from 'react';

interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  picture?: string;
}

interface UseLinkedInReturn {
  profile: LinkedInProfile | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

// LinkedIn OAuth config
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/callback`
  : '';

// OAuth scopes - we only need basic profile info
const SCOPES = ['openid', 'profile'].join(' ');

export function useLinkedIn(): UseLinkedInReturn {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for stored profile on mount
  useEffect(() => {
    const stored = localStorage.getItem('ooo_linkedin_profile');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        localStorage.removeItem('ooo_linkedin_profile');
      }
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('ooo_oauth_state');

      if (code && state && state === storedState) {
        setIsLoading(true);
        setError(null);
        
        try {
          // Exchange code for profile via our API
          const response = await fetch('/api/linkedin/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
          });

          if (!response.ok) {
            throw new Error('Failed to authenticate with LinkedIn');
          }

          const profileData = await response.json();
          setProfile(profileData);
          localStorage.setItem('ooo_linkedin_profile', JSON.stringify(profileData));
          
          // Clean up URL
          window.history.replaceState({}, '', window.location.pathname + '#app');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
          setIsLoading(false);
          sessionStorage.removeItem('ooo_oauth_state');
        }
      }
    };

    handleCallback();
  }, []);

  // Initiate OAuth flow
  const connect = useCallback(() => {
    if (!LINKEDIN_CLIENT_ID) {
      setError('LinkedIn OAuth not configured');
      return;
    }

    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('ooo_oauth_state', state);

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('state', state);

    window.location.href = authUrl.toString();
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    setProfile(null);
    localStorage.removeItem('ooo_linkedin_profile');
  }, []);

  return {
    profile,
    isConnected: profile !== null,
    isLoading,
    error,
    connect,
    disconnect,
  };
}
