module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    console.log('Auth endpoint called - Client ID available:', !!clientId);
    
    if (!clientId) {
      return res.status(500).json({ 
        error: 'GitHub client ID not configured',
        debug: 'Environment variable GITHUB_CLIENT_ID is missing'
      });
    }

    const redirectUri = `https://workik-task.vercel.app/api/callback`;
    const scope = 'repo user:email';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    console.log('Redirecting to GitHub OAuth:', githubAuthUrl);
    console.log('Expected callback URL:', redirectUri);
    
    res.writeHead(302, { Location: githubAuthUrl });
    res.end();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
