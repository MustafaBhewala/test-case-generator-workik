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
    const { files, owner, repo } = req.body;
    
    if (!files || !Array.isArray(files) || !owner || !repo) {
      return res.status(400).json({ error: 'Files array, owner, and repo parameters are required' });
    }

    console.log(`Generating test summaries for ${files.length} files in ${owner}/${repo}`);

    // Filter for code files that can have tests generated
    const codeFiles = files.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rb', 'php'].includes(ext);
    });

    if (codeFiles.length === 0) {
      return res.json({
        summaries: [],
        processedFiles: 0,
        totalFiles: files.length,
        message: 'No code files found that can have tests generated'
      });
    }

    // Generate mock test summaries for now (you can integrate with Google Gemini later)
    const summaries = codeFiles.slice(0, 5).map((file, index) => {
      const ext = file.name.toLowerCase().split('.').pop();
      let framework = 'Jest';
      
      // Determine test framework based on file extension
      switch (ext) {
        case 'py':
          framework = 'pytest';
          break;
        case 'java':
          framework = 'JUnit';
          break;
        case 'cs':
          framework = 'NUnit';
          break;
        case 'go':
          framework = 'Go testing';
          break;
        case 'rb':
          framework = 'RSpec';
          break;
        case 'php':
          framework = 'PHPUnit';
          break;
        case 'c':
        case 'cpp':
          framework = 'Google Test';
          break;
        default:
          framework = 'Jest';
      }

      return {
        id: `test-${index + 1}`,
        title: `Test cases for ${file.name}`,
        description: `Comprehensive test suite covering main functionality, edge cases, and error handling for ${file.name}`,
        framework: framework,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        estimatedLines: Math.floor(Math.random() * 100) + 50,
        dependencies: framework === 'Jest' ? ['@jest/globals'] : framework === 'pytest' ? ['pytest'] : [framework.toLowerCase()],
        filePath: file.path
      };
    });

    console.log(`Generated ${summaries.length} test summaries`);

    res.json({
      summaries,
      processedFiles: codeFiles.length,
      totalFiles: files.length
    });

  } catch (error) {
    console.error('Error generating test summaries:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};
