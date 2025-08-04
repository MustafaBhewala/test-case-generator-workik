import { Router } from 'express';
import { GitHubService } from '../services/github';

const router = Router();
const githubService = new GitHubService();

// Get user info
router.get('/user', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const user = await githubService.getUser(token);
    res.json(user);
  } catch (error) {
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

    const repos = await githubService.getUserRepositories(token);
    res.json(repos);
  } catch (error) {
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
    const path = req.query.path as string || '';
    
    const contents = await githubService.getRepositoryContents(token, owner, repo, path);
    res.json(contents);
  } catch (error) {
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
    
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const content = await githubService.getFileContent(token, owner, repo, path);
    res.json({ content });
  } catch (error) {
    next(error);
  }
});

// Create pull request with test cases
router.post('/repos/:owner/:repo/pull-request', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const { owner, repo } = req.params;
    const { title, body, testFiles, branchName } = req.body;

    // Create branch and add test files
    const branch = branchName || `test-cases-${Date.now()}`;
    
    // Upload test files to the branch
    for (const testFile of testFiles) {
      await githubService.createOrUpdateFile(
        token,
        owner,
        repo,
        `tests/${testFile.filename}`,
        `Add generated test: ${testFile.filename}`,
        testFile.code,
        branch
      );
    }

    // Create pull request
    const pr = await githubService.createPullRequest(
      token,
      owner,
      repo,
      title,
      body,
      branch
    );

    res.json(pr);
  } catch (error) {
    next(error);
  }
});

export { router as githubRoutes };
