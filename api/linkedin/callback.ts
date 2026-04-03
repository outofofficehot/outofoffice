// Vercel Serverless Function: LinkedIn OAuth Callback
// POST /api/linkedin/callback

import type { VercelRequest, VercelResponse } from '@vercel/node';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'Missing code or redirectUri' });
  }

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return res.status(500).json({ error: 'LinkedIn OAuth not configured on server' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return res.status(401).json({ error: 'Failed to exchange code for token' });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile using OpenID Connect userinfo endpoint
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error('Profile fetch failed:', errorData);
      return res.status(401).json({ error: 'Failed to fetch profile' });
    }

    const profileData = await profileResponse.json();

    // Return sanitized profile data
    const profile = {
      id: profileData.sub, // LinkedIn member ID (OpenID subject)
      firstName: profileData.given_name || '',
      lastName: profileData.family_name || '',
      profileUrl: `https://www.linkedin.com/in/${profileData.sub}`,
      picture: profileData.picture || null,
    };

    return res.status(200).json(profile);
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
