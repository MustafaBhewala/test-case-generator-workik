export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  updated_at: string;
  owner?: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  download_url: string | null;
  html_url: string;
  content?: string;
}

export interface TestCaseSummary {
  id: string;
  title: string;
  description: string;
  framework: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedLines: number;
  dependencies: string[];
  filePath?: string;
}

export interface GeneratedTestCase {
  id: string;
  summary: TestCaseSummary;
  code: string;
  filename: string;
  language: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: GitHubUser | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}
