// Vercel Serverless Function: Search LinkedIn Connections
// GET /api/linkedin/connections?q=search_query

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const accessToken = authHeader.substring(7);
  const query = (req.query.q as string || '').toLowerCase();

  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  try {
    // LinkedIn Connections API
    // Note: This requires the r_1st_connections permission which needs special approval
    const response = await fetch(
      `https://api.linkedin.com/v2/connections?q=viewer&start=0&count=50`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LinkedIn connections API error:', response.status, errorText);
      
      // If connections API fails, return empty (permission likely not granted)
      if (response.status === 403) {
        return res.status(200).json({ 
          connections: [],
          message: 'Connections access not available. Use LinkedIn URL instead.'
        });
      }
      
      return res.status(response.status).json({ error: 'Failed to fetch connections' });
    }

    const data = await response.json();
    
    // Filter connections by search query
    const connections = (data.elements || [])
      .filter((conn: any) => {
        const fullName = `${conn.firstName?.localized?.en_US || ''} ${conn.lastName?.localized?.en_US || ''}`.toLowerCase();
        return fullName.includes(query);
      })
      .slice(0, 10)
      .map((conn: any) => ({
        id: conn.id,
        firstName: conn.firstName?.localized?.en_US || '',
        lastName: conn.lastName?.localized?.en_US || '',
        headline: conn.headline?.localized?.en_US || '',
        profileUrl: `https://www.linkedin.com/in/${conn.vanityName || conn.id}`,
        picture: conn.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || null,
      }));

    return res.status(200).json({ connections });
  } catch (error) {
    console.error('Connections search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
