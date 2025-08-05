import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GitHubUser, AuthContextType } from '../types';

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
    const storedUser = localStorage.getItem('github_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(user);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
      }
    } else {
      // Check if we're returning from OAuth (not needed for demo, but keeping for completeness)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code && window.location.pathname === '/auth/callback') {
        // For demo, just redirect to home
        window.location.href = '/';
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    // For demo purposes, simulate successful login with mock data
    const mockUser = {
      id: 1,
      login: 'demo-user',
      name: 'Demo User',
      avatar_url: 'https://github.com/github.png',
      email: 'demo@example.com'
    };
    
    const mockToken = 'demo-token-' + Date.now();
    
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('github_token', mockToken);
    localStorage.setItem('github_user', JSON.stringify(mockUser));
    
    // Show a brief success message
    console.log('Demo login successful!');
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
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
