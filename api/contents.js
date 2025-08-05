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
    
    // Extract owner, repo, and path from the URL
    // Expected URL format: /api/github/repos/owner/repo/contents?path=somepath
    const { owner, repo } = req.query;
    const path = req.query.path || '';
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo parameters are required' });
    }

    console.log(`Fetching contents for ${owner}/${repo} at path: ${path || 'root'}`);

    // Fetch repository contents from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`;
    const response = await fetch(apiUrl, {
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
        error: 'Failed to fetch repository contents from GitHub',
        details: errorData 
      });
    }

    const contents = await response.json();
    console.log(`Successfully fetched ${Array.isArray(contents) ? contents.length : 1} items`);

    // If it's a single file, return it as is
    if (!Array.isArray(contents)) {
      res.json([contents]);
      return;
    }

    // Return simplified content data for directories
    const simplifiedContents = contents.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type, // 'file' or 'dir'
      size: item.size,
      download_url: item.download_url,
      html_url: item.html_url,
      sha: item.sha
    }));

    res.json(simplifiedContents);
  } catch (error) {
    console.error('Error fetching repository contents:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
