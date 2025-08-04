import { Router } from 'express';
import { AIService } from '../services/ai';
import { GitHubService } from '../services/github';

const router = Router();
const githubService = new GitHubService();

// Lazy instantiation of AIService
const getAIService = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required. Please add it to your .env file.');
  }
  return new AIService();
};

// Generate test case summaries
router.post('/generate-summaries', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const { files, owner, repo } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array is required' });
    }

    // Fetch file contents
    const filesWithContent = await Promise.all(
      files.map(async (file: any) => {
        if (file.type === 'file' && file.download_url) {
          try {
            const content = await githubService.getFileContent(token, owner, repo, file.path);
            return { ...file, content };
          } catch (error) {
            console.error(`Failed to fetch content for ${file.path}:`, error);
            return file;
          }
        }
        return file;
      })
    );

    // Filter only files with content and supported extensions
    const codeFiles = filesWithContent.filter(file => 
      file.content && 
      /\.(js|jsx|ts|tsx|py|java|cs|go)$/.test(file.name)
    );

    if (codeFiles.length === 0) {
      return res.status(400).json({ error: 'No supported code files found' });
    }

    const summaries = await getAIService().generateTestCaseSummaries({ files: codeFiles });
    
    res.json({
      summaries,
      processedFiles: codeFiles.length,
      totalFiles: files.length
    });
  } catch (error) {
    next(error);
  }
});

// Generate test code for a specific summary
router.post('/generate-test-code', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const { summary, files, owner, repo } = req.body;
    
    if (!summary || !files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Summary and files are required' });
    }

    // Fetch file contents if not already present
    const filesWithContent = await Promise.all(
      files.map(async (file: any) => {
        if (file.type === 'file' && !file.content && file.download_url) {
          try {
            const content = await githubService.getFileContent(token, owner, repo, file.path);
            return { ...file, content };
          } catch (error) {
            console.error(`Failed to fetch content for ${file.path}:`, error);
            return file;
          }
        }
        return file;
      })
    );

    const testCase = await getAIService().generateTestCode(filesWithContent, summary);
    
    res.json(testCase);
  } catch (error) {
    next(error);
  }
});

export { router as aiRoutes };
