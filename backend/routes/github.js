const { Router } = require('express');
const axios = require('axios');

const router = Router();

// GitHub API base URL
const baseURL = 'https://api.github.com';

function getHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Test-Case-Generator'
  };
}

// Get user info
router.get('/user', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const response = await axios.get(`${baseURL}/user`, {
      headers: getHeaders(token)
    });
    res.json(response.data);
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    next(error);
  }
});

// Get user repositories
router.get('/repos', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const response = await axios.get(`${baseURL}/user/repos`, {
      headers: getHeaders(token),
      params: {
        sort: 'updated',
        per_page: 100
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Get repos error:', error.response?.data || error.message);
    next(error);
  }
});

// Get repository contents
router.get('/repos/:owner/:repo/contents', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const { owner, repo } = req.params;
    const path = req.query.path || '';
    
    const response = await axios.get(
      `${baseURL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: getHeaders(token)
      }
    );
    
    const contents = Array.isArray(response.data) ? response.data : [response.data];
    res.json(contents);
  } catch (error) {
    console.error('Get contents error:', error.response?.data || error.message);
    next(error);
  }
});

// Get file content
router.post('/repos/:owner/:repo/file-content', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const { owner, repo } = req.params;
    const { path } = req.body;
    
    const response = await axios.get(
      `${baseURL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: getHeaders(token)
      }
    );
    
    let content = '';
    if (response.data.content) {
      content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    
    res.json({ content });
  } catch (error) {
    console.error('Get file content error:', error.response?.data || error.message);
    next(error);
  }
});

module.exports = router;
