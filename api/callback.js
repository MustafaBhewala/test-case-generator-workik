module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Parse query parameters from the URL
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    console.log('Callback received:', { code: !!code, error, errorDescription, fullUrl: req.url });
    
    // Handle GitHub OAuth errors
    if (error) {
      console.error('GitHub OAuth error:', error, errorDescription);
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=${error}&description=${encodeURIComponent(errorDescription || '')}` 
      });
      res.end();
      return;
    }
    
    if (!code) {
      console.error('No authorization code provided in callback');
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=no_code&description=${encodeURIComponent('No authorization code received from GitHub')}` 
      });
      res.end();
      return;
    }

    console.log('Exchanging code for access token...');
    
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
    console.log('Token exchange result:', { success: !!tokenData.access_token, error: tokenData.error });
    
    if (tokenData.access_token) {
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/auth/callback?token=${tokenData.access_token}` 
      });
      res.end();
      return;
    } else {
      console.error('Failed to get access token:', tokenData);
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=token_exchange_failed&description=${encodeURIComponent(tokenData.error_description || 'Failed to exchange code for token')}` 
      });
      res.end();
      return;
    }
  } catch (error) {
    console.error('Auth callback error:', error);
    res.writeHead(302, { 
      Location: `https://workik-task.vercel.app/?error=callback_error&description=${encodeURIComponent(error.message)}` 
    });
    res.end();
    return;
  }
};
