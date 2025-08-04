import axios from 'axios';
import { GitHubRepository, GitHubFile, GitHubUser } from '../types';

export class GitHubService {
  private baseURL = 'https://api.github.com';

  private getHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Test-Case-Generator'
    };
  }

  async getUser(token: string): Promise<GitHubUser> {
    const response = await axios.get(`${this.baseURL}/user`, {
      headers: this.getHeaders(token)
    });
    return response.data;
  }

  async getUserRepositories(token: string): Promise<GitHubRepository[]> {
    const response = await axios.get(`${this.baseURL}/user/repos`, {
      headers: this.getHeaders(token),
      params: {
        sort: 'updated',
        per_page: 100
      }
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
      `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: this.getHeaders(token)
      }
    );
    return Array.isArray(response.data) ? response.data : [response.data];
  }

  async getFileContent(
    token: string,
    owner: string,
    repo: string,
    path: string
  ): Promise<string> {
    const response = await axios.get(
      `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: this.getHeaders(token)
      }
    );
    
    if (response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    throw new Error('File content not found');
  }

  async createPullRequest(
    token: string,
    owner: string,
    repo: string,
    title: string,
    body: string,
    head: string,
    base: string = 'main'
  ) {
    const response = await axios.post(
      `${this.baseURL}/repos/${owner}/${repo}/pulls`,
      {
        title,
        body,
        head,
        base
      },
      {
        headers: this.getHeaders(token)
      }
    );
    return response.data;
  }

  async createOrUpdateFile(
    token: string,
    owner: string,
    repo: string,
    path: string,
    message: string,
    content: string,
    branch: string
  ) {
    const encodedContent = Buffer.from(content).toString('base64');
    
    const response = await axios.put(
      `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
      {
        message,
        content: encodedContent,
        branch
      },
      {
        headers: this.getHeaders(token)
      }
    );
    return response.data;
  }
}
