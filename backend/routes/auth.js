const { Router } = require('express');
const axios = require('axios');

const router = Router();

// GitHub OAuth callback
router.post('/github/callback', async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const { access_token, error } = tokenResponse.data;

    if (error) {
      return res.status(400).json({ error: `GitHub OAuth error: ${error}` });
    }

    if (!access_token) {
      return res.status(400).json({ error: 'No access token received from GitHub' });
    }

    // Optionally, you can verify the token by getting user info
    try {
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      res.json({
        access_token,
        user: userResponse.data,
      });
    } catch (userError) {
      // Even if user fetch fails, return the token
      res.json({ access_token });
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    next(error);
  }
});

module.exports = router;
