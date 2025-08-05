module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const urlParams = new URL(req.url, `https://${req.headers.host}`);
  const code = urlParams.searchParams.get('code');
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
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
    console.error('Auth callback error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};
