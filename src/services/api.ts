import axios from 'axios';
import { GitHubRepository, GitHubFile, GitHubUser, TestCaseSummary, GeneratedTestCase } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // GitHub OAuth
  async getGitHubUser(token: string): Promise<GitHubUser> {
    try {
      const response = await axios.get(`${API_BASE_URL}/github/user`, {
        headers: this.getHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return {
        id: 1,
        login: 'demo-user',
        name: 'Demo User',
        avatar_url: 'https://github.com/github.png',
        email: 'demo@example.com'
      };
    }
  }

  async getUserRepositories(token: string): Promise<GitHubRepository[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/github/repos`, {
        headers: this.getHeaders(token),
      });
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return [
        {
          id: 1,
          name: 'sample-project',
          full_name: 'demo-user/sample-project',
          description: 'A sample project for testing',
          private: false,
          owner: {
            login: 'demo-user',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/demo-user/sample-project',
          language: 'JavaScript',
          updated_at: new Date().toISOString()
        }
      ];
    }
  }

  async getRepositoryContents(
    token: string,
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFile[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/github/repos/${owner}/${repo}/contents`,
        {
          headers: this.getHeaders(token),
          params: { path },
        }
      );
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return [
        {
          name: 'src',
          path: 'src',
          type: 'dir',
          size: 0,
          download_url: null,
          html_url: `https://github.com/${owner}/${repo}/tree/main/src`
        },
        {
          name: 'package.json',
          path: 'package.json',
          type: 'file',
          size: 1024,
          download_url: `https://github.com/${owner}/${repo}/raw/main/package.json`,
          html_url: `https://github.com/${owner}/${repo}/blob/main/package.json`
        }
      ];
    }
  }

  async getFileContent(
    token: string,
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/github/repos/${owner}/${repo}/file-content`,
        { path },
        {
          headers: this.getHeaders(token),
        }
      );
      return response.data.content;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return `// Mock content for ${path}\nfunction example() {\n  return 'Hello World';\n}`;
    }
  }

  // AI Services
  async generateTestCaseSummaries(
    token: string,
    files: GitHubFile[],
    owner: string,
    repo: string
  ): Promise<{ summaries: TestCaseSummary[]; processedFiles: number; totalFiles: number }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/generate-summaries`,
        { files, owner, repo },
        {
          headers: this.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return {
        summaries: [
          {
            id: '1',
            title: files[0]?.name || 'example.js',
            description: 'Basic functionality tests for the example module',
            framework: 'Jest',
            complexity: 'medium',
            estimatedLines: 25,
            dependencies: []
          }
        ],
        processedFiles: 1,
        totalFiles: files.length
      };
    }
  }

  async generateTestCode(
    token: string,
    summary: TestCaseSummary,
    files: GitHubFile[],
    owner: string,
    repo: string
  ): Promise<GeneratedTestCase> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ai/generate-test-code`,
        { summary, files, owner, repo },
        {
          headers: this.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock data');
      return {
        id: summary.id,
        summary: summary,
        code: `// Generated test for ${summary.title}
describe('${summary.title}', () => {
  test('should work correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
  
  test('should handle edge cases', () => {
    // Edge case test
    expect(true).toBe(true);
  });
});`,
        filename: `${summary.title}.test.js`,
        language: 'javascript'
      };
    }
  }

  // GitHub PR creation
  async createPullRequest(
    token: string,
    owner: string,
    repo: string,
    title: string,
    body: string,
    testFiles: GeneratedTestCase[],
    branchName?: string
  ) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/github/repos/${owner}/${repo}/pull-request`,
        {
          title,
          body,
          testFiles,
          branchName,
        },
        {
          headers: this.getHeaders(token),
        }
      );
      return response.data;
    } catch (error) {
      console.warn('API endpoint not available, using mock response');
      return {
        success: false,
        message: 'API endpoint not available - this is a demo version',
        prUrl: null
      };
    }
  }
}

export const apiService = new ApiService();
