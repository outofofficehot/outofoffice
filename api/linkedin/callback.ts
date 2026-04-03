// Vercel Serverless Function: LinkedIn OAuth Callback
// POST /api/linkedin/callback

import type { VercelRequest, VercelResponse } from '@vercel/node';

const LINKEDIN_CLIENT_ID = process.env.VITE_LINKEDIN_CLIENT_ID || '';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, redirectUri } = req.body;

  if (!code || !redirectUri) {
    return res.status(400).json({ error: 'Missing code or redirectUri', received: { code: !!code, redirectUri: !!redirectUri } });
  }

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    console.error('Missing LinkedIn credentials:', { 
      hasClientId: !!LINKEDIN_CLIENT_ID, 
      hasClientSecret: !!LINKEDIN_CLIENT_SECRET 
    });
    return res.status(500).json({ error: 'LinkedIn OAuth not configured on server' });
  }

  try {
    // Exchange authorization code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    });

    console.log('Token exchange request:', { redirectUri, clientId: LINKEDIN_CLIENT_ID.substring(0, 4) + '...' });

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    const tokenText = await tokenResponse.text();
    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenText);
      return res.status(401).json({ error: 'Failed to exchange code for token', details: tokenText });
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('Failed to parse token response:', tokenText);
      return res.status(500).json({ error: 'Invalid token response from LinkedIn' });
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('No access token in response:', tokenData);
      return res.status(401).json({ error: 'No access token received' });
    }

    // Fetch user profile using OpenID Connect userinfo endpoint
    console.log('Fetching user profile...');
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const profileText = await profileResponse.text();
    console.log('Profile response status:', profileResponse.status);

    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileText);
      return res.status(401).json({ error: 'Failed to fetch profile', details: profileText });
    }

    let profileData;
    try {
      profileData = JSON.parse(profileText);
    } catch (e) {
      console.error('Failed to parse profile response:', profileText);
      return res.status(500).json({ error: 'Invalid profile response from LinkedIn' });
    }

    console.log('Profile data received:', { sub: profileData.sub, name: profileData.name });

    // Return sanitized profile data + access token for connections search
    const profile = {
      id: profileData.sub, // LinkedIn member ID (OpenID subject)
      firstName: profileData.given_name || '',
      lastName: profileData.family_name || '',
      profileUrl: `https://www.linkedin.com/in/${profileData.sub}`,
      picture: profileData.picture || null,
    };

    return res.status(200).json({ 
      profile,
      // Include access token so frontend can search connections
      // Note: In production, you might want to handle this server-side
      accessToken,
    });
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
