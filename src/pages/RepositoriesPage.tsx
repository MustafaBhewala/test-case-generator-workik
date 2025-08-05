import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Search, Book, Calendar, GitBranch, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { GitHubRepository } from '../types';

export function RepositoriesPage() {
  const { token } = useAuth();
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Redirect to home if not authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (token) {
      fetchRepositories();
    }
  }, [token]);

  useEffect(() => {
    const filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
  }, [repositories, searchTerm]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const repos = await apiService.getUserRepositories(token!);
      setRepositories(repos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch repositories. Please try again.');
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Your Repositories
        </h1>
        <p className="text-gray-300 mb-6">
          Select a repository to browse files and generate test cases.
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRepos.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No repositories found
            </h3>
            <p className="text-gray-300">
              {searchTerm ? 'Try adjusting your search terms.' : 'You don\'t have any repositories yet.'}
            </p>
          </div>
        ) : (
          filteredRepos.map((repo) => {
            // Extract owner from full_name (format: "owner/repo")
            const owner = repo.full_name.split('/')[0];
            
            return (
              <Link
                key={repo.id}
                to={`/repository/${owner}/${repo.name}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all"
              >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-400 truncate">
                      {repo.name}
                    </h3>
                    {repo.private && (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {repo.description && (
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {repo.language && (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <GitBranch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
