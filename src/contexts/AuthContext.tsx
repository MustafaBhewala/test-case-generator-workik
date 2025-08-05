import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GitHubUser, AuthContextType } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      // Check if we're returning from OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && window.location.pathname === '/auth/callback') {
        handleOAuthCallback(code);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/github/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, user } = data;
        
        localStorage.setItem('github_token', access_token);
        setToken(access_token);
        
        if (user) {
          setUser(user);
        } else {
          await fetchUser(access_token);
        }
        
        // Redirect to repositories page
        window.location.href = '/repositories';
      } else {
        throw new Error('Failed to exchange code for token');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      window.location.href = '/?error=oauth_failed';
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (authToken: string) => {
    try {
      const userData = await apiService.getGitHubUser(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('github_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'repo user:email';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
