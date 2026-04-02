// LinkedIn URL parsing and hashing utilities

import { Fr } from '@aztec/aztec.js';
import { poseidon2Hash } from '@aztec/circuits.js';

/**
 * Extract LinkedIn username/ID from various URL formats
 * 
 * Supports:
 * - https://www.linkedin.com/in/username
 * - https://linkedin.com/in/username
 * - linkedin.com/in/username
 * - /in/username
 * - username (if no slashes)
 */
export function extractLinkedInId(input: string): string | null {
  const trimmed = input.trim();
  
  // Direct username (no slashes)
  if (!trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed.toLowerCase();
  }
  
  // URL patterns
  const patterns = [
    /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i,
    /\/in\/([a-zA-Z0-9-]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }
  
  return null;
}

/**
 * Hash a LinkedIn ID for privacy
 * 
 * Uses Poseidon hash (ZK-friendly) to create a deterministic
 * but non-reversible hash of the LinkedIn ID
 */
export function hashLinkedInId(linkedInId: string): Fr {
  // Convert string to field elements
  const encoder = new TextEncoder();
  const bytes = encoder.encode(linkedInId.toLowerCase());
  
  // Pad to 31 bytes (max for a field element)
  const padded = new Uint8Array(31);
  padded.set(bytes.slice(0, 31));
  
  // Convert to field element
  const field = Fr.fromBuffer(Buffer.from(padded));
  
  // Hash with Poseidon
  return poseidon2Hash([field]);
}

/**
 * Validate a LinkedIn profile URL or username
 */
export function isValidLinkedIn(input: string): boolean {
  return extractLinkedInId(input) !== null;
}

// LinkedIn OAuth configuration
export const LINKEDIN_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'http://localhost:5173/callback',
  scope: 'r_liteprofile r_emailaddress',
  authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
};

/**
 * Generate LinkedIn OAuth URL
 */
export function getLinkedInAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_OAUTH_CONFIG.clientId,
    redirect_uri: LINKEDIN_OAUTH_CONFIG.redirectUri,
    scope: LINKEDIN_OAUTH_CONFIG.scope,
    state,
  });
  
  return `${LINKEDIN_OAUTH_CONFIG.authUrl}?${params.toString()}`;
}
