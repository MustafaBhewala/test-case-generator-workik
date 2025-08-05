const cors = require('cors');
require('dotenv').config();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://workik-task.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple test endpoint
  if (req.url === '/api/test' || req.url === '/test') {
    return res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
  }

  // GitHub OAuth endpoints
  if (req.url === '/api/auth/github' || req.url === '/auth/github') {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `https://workik-task.vercel.app/api/auth/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
    res.writeHead(302, { Location: githubAuthUrl });
    res.end();
    return;
  }

  if (req.url?.startsWith('/api/auth/callback') || req.url?.startsWith('/auth/callback')) {
    const urlParams = new URL(req.url, `https://${req.headers.host}`);
    const code = urlParams.searchParams.get('code');
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const tokenData = await response.json();
      
      if (tokenData.access_token) {
        res.writeHead(302, { 
          Location: `https://workik-task.vercel.app/auth/callback?token=${tokenData.access_token}` 
        });
        res.end();
        return;
      } else {
        return res.status(400).json({ error: 'Failed to get access token', details: tokenData });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  }

  // Default response
  res.status(404).json({ error: 'Endpoint not found' });
};
