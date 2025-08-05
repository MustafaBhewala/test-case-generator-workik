module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { owner, repo, path } = req.body;
    
    if (!owner || !repo || !path) {
      return res.status(400).json({ error: 'Owner, repo, and path parameters are required' });
    }

    console.log(`Fetching file content for ${owner}/${repo}/${path}`);

    // Fetch file content from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
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
        error: 'Failed to fetch file content from GitHub',
        details: errorData 
      });
    }

    const fileData = await response.json();
    
    // Decode base64 content
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    console.log(`Successfully fetched file content (${content.length} characters)`);

    res.json({ content });
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
