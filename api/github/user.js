module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Fetching GitHub user with token:', token.substring(0, 10) + '...');

    // Fetch user data from GitHub API
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Test-Case-Generator'
      }
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('GitHub API error details:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to fetch user data from GitHub',
        details: errorData 
      });
    }

    const user = await response.json();
    console.log('Successfully fetched GitHub user:', user.login);

    // Return simplified user data
    const simplifiedUser = {
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      email: user.email,
      public_repos: user.public_repos
    };

    res.json(simplifiedUser);
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
