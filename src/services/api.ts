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
    const response = await axios.get(`${API_BASE_URL}/github/user`, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  async getUserRepositories(token: string): Promise<GitHubRepository[]> {
    const response = await axios.get(`${API_BASE_URL}/github/repos`, {
      headers: this.getHeaders(token),
    });
    return response.data;
  }

  async getRepositoryContents(
    token: string,
    owner: string,
    repo: string,
    path: string = ''
  ): Promise<GitHubFile[]> {
    const response = await axios.get(
      `${API_BASE_URL}/github/repos/${owner}/${repo}/contents`,
      {
        headers: this.getHeaders(token),
        params: { path },
      }
    );
    return response.data;
  }

  async getFileContent(
    token: string,
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    const response = await axios.post(
      `${API_BASE_URL}/github/repos/${owner}/${repo}/file-content`,
      { path },
      {
        headers: this.getHeaders(token),
      }
    );
    return response.data.content;
  }

  // AI Services
  async generateTestCaseSummaries(
    token: string,
    files: GitHubFile[],
    owner: string,
    repo: string
  ): Promise<{ summaries: TestCaseSummary[]; processedFiles: number; totalFiles: number }> {
    const response = await axios.post(
      `${API_BASE_URL}/ai/generate-summaries`,
      { files, owner, repo },
      {
        headers: this.getHeaders(token),
      }
    );
    return response.data;
  }

  async generateTestCode(
    token: string,
    summary: TestCaseSummary,
    files: GitHubFile[],
    owner: string,
    repo: string
  ): Promise<GeneratedTestCase> {
    const response = await axios.post(
      `${API_BASE_URL}/ai/generate-test-code`,
      { summary, files, owner, repo },
      {
        headers: this.getHeaders(token),
      }
    );
    return response.data;
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
  }
}

export const apiService = new ApiService();
