module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Fetching repositories with token:', token.substring(0, 10) + '...');

    // Fetch repositories from GitHub API
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
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
        error: 'Failed to fetch repositories from GitHub',
        details: errorData 
      });
    }

    const repositories = await response.json();
    console.log(`Successfully fetched ${repositories.length} repositories`);

    // Return simplified repository data
    const simplifiedRepos = repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      updated_at: repo.updated_at,
      private: repo.private,
      html_url: repo.html_url
    }));

    res.json(simplifiedRepos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
