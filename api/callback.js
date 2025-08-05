module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Log everything for debugging
    console.log('=== CALLBACK DEBUG ===');
    console.log('req.url:', req.url);
    console.log('req.query:', req.query);
    console.log('req.method:', req.method);
    
    // Multiple ways to get the code parameter
    let code = null;
    let error = null;
    
    // Method 1: req.query (Vercel should populate this)
    if (req.query && req.query.code) {
      code = req.query.code;
      console.log('Code from req.query:', code);
    }
    
    // Method 2: Parse URL manually
    if (!code && req.url) {
      const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
      code = urlParams.get('code');
      error = urlParams.get('error');
      console.log('Code from URLSearchParams:', code);
      console.log('Error from URLSearchParams:', error);
    }
    
    // Method 3: Try URL constructor (backup)
    if (!code && req.url) {
      try {
        const fullUrl = new URL(req.url, `https://${req.headers.host}`);
        code = fullUrl.searchParams.get('code');
        error = fullUrl.searchParams.get('error');
        console.log('Code from URL constructor:', code);
      } catch (e) {
        console.log('URL constructor failed:', e.message);
      }
    }
    
    console.log('Final code value:', code);
    console.log('Final error value:', error);
    
    // Handle GitHub OAuth errors
    if (error) {
      console.error('GitHub OAuth error:', error);
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=${error}&description=${encodeURIComponent('GitHub OAuth error')}` 
      });
      res.end();
      return;
    }
    
    if (!code) {
      console.error('No authorization code found after all parsing attempts');
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=no_code&description=${encodeURIComponent('No authorization code received from GitHub')}` 
      });
      res.end();
      return;
    }

    console.log('Exchanging code for access token...', code.substring(0, 10) + '...');
    
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
      console.log('Success! Redirecting with token...');
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
