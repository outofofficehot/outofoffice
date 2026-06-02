// LinkedIn OAuth hook for Out Of Office
import { useState, useEffect, useCallback } from 'react';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileUrl: string;
  picture?: string;
}

export interface LinkedInConnection {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  picture?: string;
  profileUrl: string;
}

interface UseLinkedInReturn {
  profile: LinkedInProfile | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  searchConnections: (query: string) => Promise<LinkedInConnection[]>;
  connectionsAvailable: boolean;
}

// LinkedIn OAuth config
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/callback`
  : '';

// OAuth scopes - profile + connections
const SCOPES = ['openid', 'profile', 'r_1st_connections'].join(' ');

// Demo mode: if no LinkedIn client ID configured, or ?demo=true in URL
const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return !LINKEDIN_CLIENT_ID || params.get('demo') === 'true';
};

// Fake demo profiles for demo mode
const DEMO_PROFILE: LinkedInProfile = {
  id: 'demo-user-12345',
  firstName: 'Demo',
  lastName: 'User',
  profileUrl: 'https://linkedin.com/in/demo-user',
  picture: 'https://i.pravatar.cc/150?u=demo',
};

const DEMO_CONNECTIONS: LinkedInConnection[] = [
  { id: 'conn-1', firstName: 'Sarah', lastName: 'Chen', headline: 'Product Manager at TechCo', profileUrl: 'https://linkedin.com/in/sarah-chen', picture: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'conn-2', firstName: 'James', lastName: 'Wilson', headline: 'Software Engineer', profileUrl: 'https://linkedin.com/in/james-wilson', picture: 'https://i.pravatar.cc/150?u=james' },
  { id: 'conn-3', firstName: 'Emma', lastName: 'Rodriguez', headline: 'Founder & CEO', profileUrl: 'https://linkedin.com/in/emma-rodriguez', picture: 'https://i.pravatar.cc/150?u=emma' },
  { id: 'conn-4', firstName: 'Alex', lastName: 'Kim', headline: 'Designer at StartupXYZ', profileUrl: 'https://linkedin.com/in/alex-kim', picture: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'conn-5', firstName: 'Michael', lastName: 'Johnson', headline: 'Investor', profileUrl: 'https://linkedin.com/in/michael-johnson', picture: 'https://i.pravatar.cc/150?u=michael' },
];

export function useLinkedIn(): UseLinkedInReturn {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connectionsAvailable, setConnectionsAvailable] = useState(false);

  // Check for stored profile on mount
  useEffect(() => {
    const stored = localStorage.getItem('ooo_linkedin_profile');
    const storedToken = localStorage.getItem('ooo_linkedin_token');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
        if (storedToken) {
          setAccessToken(storedToken);
          setConnectionsAvailable(true);
        }
      } catch {
        localStorage.removeItem('ooo_linkedin_profile');
        localStorage.removeItem('ooo_linkedin_token');
      }
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');
      const errorDesc = params.get('error_description');
      const storedState = sessionStorage.getItem('ooo_oauth_state');

      if (errorParam) {
        setError(`LinkedIn error: ${errorDesc || errorParam}`);
        window.history.replaceState({}, '', window.location.pathname + '#app');
        sessionStorage.removeItem('ooo_oauth_state');
        return;
      }

      if (code && state && state === storedState) {
        setIsLoading(true);
        setError(null);
        
        try {
          console.log('Exchanging code for profile...', { redirectUri: REDIRECT_URI });
          
          const response = await fetch('/api/linkedin/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
          });

          const data = await response.json();
          console.log('API response:', response.status, data);

          if (!response.ok) {
            throw new Error(data.error || data.details || 'Failed to authenticate with LinkedIn');
          }

          setProfile(data.profile || data);
          localStorage.setItem('ooo_linkedin_profile', JSON.stringify(data.profile || data));
          
          // Store access token if provided (for connections search)
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            setConnectionsAvailable(true);
            localStorage.setItem('ooo_linkedin_token', data.accessToken);
          }
          
          window.history.replaceState({}, '', window.location.pathname + '#app');
        } catch (err) {
          console.error('LinkedIn auth error:', err);
          setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
          setIsLoading(false);
          sessionStorage.removeItem('ooo_oauth_state');
        }
      }
    };

    handleCallback();
  }, []);

  // Initiate OAuth flow (or demo mode)
  const connect = useCallback(async () => {
    // Demo mode: instant fake login
    if (isDemoMode()) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      setProfile(DEMO_PROFILE);
      setConnectionsAvailable(true);
      localStorage.setItem('ooo_linkedin_profile', JSON.stringify(DEMO_PROFILE));
      setIsLoading(false);
      console.log('[DEMO MODE] Fake LinkedIn login');
      return;
    }

    // Real OAuth flow
    if (!LINKEDIN_CLIENT_ID) {
      setError('LinkedIn OAuth not configured');
      return;
    }

    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('ooo_oauth_state', state);

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', SCOPES);
    authUrl.searchParams.set('state', state);

    console.log('Redirecting to LinkedIn:', authUrl.toString());
    window.location.href = authUrl.toString();
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    setProfile(null);
    setAccessToken(null);
    setConnectionsAvailable(false);
    setError(null);
    localStorage.removeItem('ooo_linkedin_profile');
    localStorage.removeItem('ooo_linkedin_token');
  }, []);

  // Search connections (demo mode returns fake connections)
  const searchConnections = useCallback(async (query: string): Promise<LinkedInConnection[]> => {
    if (query.length < 2) {
      return [];
    }

    // Demo mode: filter fake connections
    if (isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
      const q = query.toLowerCase();
      return DEMO_CONNECTIONS.filter(
        c => c.firstName.toLowerCase().includes(q) || 
             c.lastName.toLowerCase().includes(q) ||
             (c.headline?.toLowerCase().includes(q))
      );
    }

    if (!accessToken) {
      return [];
    }

    try {
      const response = await fetch(`/api/linkedin/connections?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.warn('Connections search failed:', response.status);
        setConnectionsAvailable(false);
        return [];
      }

      const data = await response.json();
      return data.connections || [];
    } catch (err) {
      console.error('Connections search error:', err);
      return [];
    }
  }, [accessToken]);

  return {
    profile,
    isConnected: profile !== null,
    isLoading,
    error,
    connect,
    disconnect,
    searchConnections,
    connectionsAvailable,
  };
}
