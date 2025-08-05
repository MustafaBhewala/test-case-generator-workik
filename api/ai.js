import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://workik-task.vercel.app',
  credentials: true
}));
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate test summaries
app.post('/generate-summaries', async (req, res) => {
  try {
    const { files, language, framework } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Files array is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const summaries = await Promise.all(
      files.map(async (file) => {
        const prompt = `
Analyze this ${language} code and generate test case summaries for ${framework || 'appropriate testing framework'}:

File: ${file.name}
Code:
${file.content}

Generate exactly 5 concise test case summaries (one line each) that cover:
1. Happy path scenarios
2. Edge cases
3. Error handling
4. Input validation
5. Integration scenarios

Format: Return only the test case descriptions, one per line.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summaries = response.text().split('\n').filter(line => line.trim()).slice(0, 5);

        return {
          fileName: file.name,
          summaries: summaries.map((summary, index) => ({
            id: `${file.name}-${index}`,
            description: summary.replace(/^\d+\.?\s*/, '').trim(),
            selected: true,
          })),
        };
      })
    );

    res.json({ summaries });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate test summaries' });
  }
});

// Generate full test code
app.post('/generate-tests', async (req, res) => {
  try {
    const { files, selectedSummaries, language, framework } = req.body;

    if (!files || !selectedSummaries) {
      return res.status(400).json({ error: 'Files and selected summaries are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const testFiles = await Promise.all(
      files.map(async (file) => {
        const fileSummaries = selectedSummaries[file.name] || [];
        
        if (fileSummaries.length === 0) {
          return null;
        }

        const prompt = `
Generate comprehensive ${framework || 'unit'} tests for this ${language} code:

File: ${file.name}
Code:
${file.content}

Test cases to implement:
${fileSummaries.map((summary, index) => `${index + 1}. ${summary.description}`).join('\n')}

Requirements:
- Use ${framework || 'appropriate testing framework'}
- Include proper imports and setup
- Add descriptive test names
- Include assertions for all scenarios
- Handle async operations if needed
- Follow best practices for ${language}

Generate complete, runnable test code:
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const testCode = response.text();

        // Extract code from markdown if present
        const codeMatch = testCode.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
        const cleanCode = codeMatch ? codeMatch[1] : testCode;

        return {
          fileName: file.name,
          testFileName: `${file.name.split('.')[0]}.test.${file.name.split('.').pop()}`,
          testCode: cleanCode,
          framework: framework || 'unit-tests',
        };
      })
    );

    const validTestFiles = testFiles.filter(Boolean);
    res.json({ testFiles: validTestFiles });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate test code' });
  }
});

export default app;
