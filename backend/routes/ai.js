const { Router } = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = Router();

// Initialize Google Gemini AI
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('GEMINI_API_KEY not found. AI features will be disabled.');
}

// Generate test case summaries
router.post('/generate-summaries', async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const { files, owner, repo } = req.body;
    
    // Mock response for now - you can implement full AI logic later
    const summaries = files.slice(0, 3).map((file, index) => ({
      id: `summary-${index + 1}`,
      title: `Test for ${file.name}`,
      description: `Comprehensive test cases for ${file.name} including edge cases and error handling`,
      framework: getTestFramework(file.name),
      complexity: 'medium',
      estimatedLines: Math.floor(Math.random() * 50) + 20,
      dependencies: []
    }));

    res.json({
      summaries,
      processedFiles: summaries.length,
      totalFiles: files.length
    });
  } catch (error) {
    console.error('Generate summaries error:', error);
    next(error);
  }
});

// Generate test code
router.post('/generate-test-code', async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const { summary, files, owner, repo } = req.body;
    
    // Mock test code generation
    const testCode = generateMockTestCode(summary);
    
    res.json({
      id: summary.id,
      summary: summary,
      code: testCode,
      filename: `${summary.title.replace(/\s+/g, '-').toLowerCase()}.test.js`,
      language: 'javascript'
    });
  } catch (error) {
    console.error('Generate test code error:', error);
    next(error);
  }
});

function getTestFramework(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'Jest';
    case 'py':
      return 'pytest';
    case 'java':
      return 'JUnit';
    case 'go':
      return 'Go Test';
    default:
      return 'Jest';
  }
}

function generateMockTestCode(summary) {
  return `// Generated test for ${summary.title}
describe('${summary.title}', () => {
  beforeEach(() => {
    // Setup test environment
  });

  test('should handle normal operations correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
  
  test('should handle edge cases', () => {
    // Edge case test
    expect(true).toBe(true);
  });

  test('should handle error conditions', () => {
    // Error handling test
    expect(true).toBe(true);
  });

  afterEach(() => {
    // Cleanup
  });
});`;
}

module.exports = router;
