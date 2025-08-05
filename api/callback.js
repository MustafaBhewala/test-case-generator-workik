module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('=== CALLBACK DEBUG ===');
    console.log('req.url:', req.url);
    console.log('req.query:', req.query);
    
    // In Vercel, query parameters are automatically parsed into req.query
    const code = req.query?.code;
    const error = req.query?.error;
    
    console.log('Extracted code:', code ? 'YES (length: ' + code.length + ')' : 'NO');
    console.log('Extracted error:', error || 'none');
    
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
      console.error('No authorization code found');
      console.log('Full req.query object:', JSON.stringify(req.query, null, 2));
      res.writeHead(302, { 
        Location: `https://workik-task.vercel.app/?error=no_code&description=${encodeURIComponent('No authorization code received from GitHub')}` 
      });
      res.end();
      return;
    }

    console.log('SUCCESS: Found authorization code, exchanging for token...');
    
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
      console.log('SUCCESS! Redirecting with token...');
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
