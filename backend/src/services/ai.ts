import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubFile, TestCaseSummary, GeneratedTestCase, AIGenerationRequest } from '../types';

export class AIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private detectLanguageAndFramework(files: GitHubFile[]): { language: string; framework: string } {
    const extensions = files.map(f => f.name.split('.').pop()?.toLowerCase());
    
    if (extensions.includes('js') || extensions.includes('jsx') || extensions.includes('ts') || extensions.includes('tsx')) {
      return { language: 'JavaScript/TypeScript', framework: 'Jest' };
    }
    if (extensions.includes('py')) {
      return { language: 'Python', framework: 'pytest' };
    }
    if (extensions.includes('java')) {
      return { language: 'Java', framework: 'JUnit' };
    }
    if (extensions.includes('cs')) {
      return { language: 'C#', framework: 'NUnit' };
    }
    if (extensions.includes('go')) {
      return { language: 'Go', framework: 'testing' };
    }
    
    return { language: 'JavaScript/TypeScript', framework: 'Jest' };
  }

  async generateTestCaseSummaries(request: AIGenerationRequest): Promise<TestCaseSummary[]> {
    const { language, framework } = this.detectLanguageAndFramework(request.files);
    
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fileContents = request.files
      .filter(f => f.content)
      .map(f => `File: ${f.path}\n\`\`\`${language.toLowerCase()}\n${f.content}\n\`\`\``)
      .join('\n\n');

    const prompt = `
Analyze the following code files and generate test case summaries for ${framework} testing framework.

${fileContents}

Generate 3-5 test case summaries in JSON format. Each summary should include:
- id: unique identifier
- title: descriptive test case title
- description: what the test will verify
- framework: "${framework}"
- complexity: "low", "medium", or "high"
- estimatedLines: estimated lines of test code
- dependencies: array of required testing dependencies

Return only valid JSON array of test case summaries, no additional text.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: generate default summaries
      return this.generateDefaultSummaries(framework);
    } catch (error) {
      console.error('AI generation error:', error);
      return this.generateDefaultSummaries(framework);
    }
  }

  async generateTestCode(
    files: GitHubFile[],
    summary: TestCaseSummary
  ): Promise<GeneratedTestCase> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fileContents = files
      .filter(f => f.content)
      .map(f => `File: ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
      .join('\n\n');

    const prompt = `
Generate a complete test case implementation for the following requirements:

Test Case Summary:
- Title: ${summary.title}
- Description: ${summary.description}
- Framework: ${summary.framework}
- Complexity: ${summary.complexity}

Source Code Files:
${fileContents}

Generate a complete, working test file using ${summary.framework}. Include:
1. All necessary imports
2. Proper test setup and teardown if needed
3. Clear test method names
4. Appropriate assertions
5. Mock implementations if required
6. Comments explaining the test logic

Return only the test code, no additional explanations.
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const code = response.text().replace(/```[\w]*\n?/g, '').trim();
      
      const extension = this.getTestFileExtension(summary.framework);
      const filename = `${summary.id}.test${extension}`;
      
      return {
        id: summary.id,
        summary,
        code,
        filename,
        language: this.getLanguageFromFramework(summary.framework)
      };
    } catch (error) {
      console.error('Test code generation error:', error);
      throw new Error('Failed to generate test code');
    }
  }

  private generateDefaultSummaries(framework: string): TestCaseSummary[] {
    return [
      {
        id: 'default-1',
        title: 'Basic Functionality Test',
        description: 'Test the main functionality of the component/function',
        framework,
        complexity: 'medium',
        estimatedLines: 20,
        dependencies: [framework.toLowerCase()]
      },
      {
        id: 'default-2',
        title: 'Edge Cases Test',
        description: 'Test edge cases and error handling',
        framework,
        complexity: 'high',
        estimatedLines: 35,
        dependencies: [framework.toLowerCase()]
      },
      {
        id: 'default-3',
        title: 'Integration Test',
        description: 'Test integration with other components',
        framework,
        complexity: 'high',
        estimatedLines: 45,
        dependencies: [framework.toLowerCase(), 'mock']
      }
    ];
  }

  private getTestFileExtension(framework: string): string {
    switch (framework.toLowerCase()) {
      case 'jest': return '.js';
      case 'junit': return '.java';
      case 'pytest': return '.py';
      case 'nunit': return '.cs';
      case 'testing': return '.go';
      default: return '.js';
    }
  }

  private getLanguageFromFramework(framework: string): string {
    switch (framework.toLowerCase()) {
      case 'jest': return 'javascript';
      case 'junit': return 'java';
      case 'pytest': return 'python';
      case 'nunit': return 'csharp';
      case 'testing': return 'go';
      default: return 'javascript';
    }
  }
}
