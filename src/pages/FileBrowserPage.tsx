import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Folder, File, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { GitHubFile } from '../types';

export function FileBrowserPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { token } = useAuth();
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<GitHubFile[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && owner && repo) {
      fetchFiles(currentPath);
    }
  }, [token, owner, repo, currentPath]);

  const fetchFiles = async (path: string = '') => {
    try {
      setLoading(true);
      const fileList = await apiService.getRepositoryContents(token!, owner!, repo!, path);
      setFiles(fileList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch files. Please try again.');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: GitHubFile) => {
    if (file.type === 'file') {
      const isSelected = selectedFiles.some(f => f.path === file.path);
      if (isSelected) {
        setSelectedFiles(selectedFiles.filter(f => f.path !== file.path));
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } else {
      setCurrentPath(file.path);
    }
  };

  const navigateBack = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Loading repository files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {owner}/{repo}
        </h1>
        <p className="text-white mb-4">
          Select files to generate test cases for.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-white">
            <span>Path:</span>
            <span className="font-mono bg-gray-800 px-2 py-1 rounded text-white">
              /{currentPath || 'root'}
            </span>
          </div>
          
          {selectedFiles.length > 0 && (
            <Link
              to={`/repository/${owner}/${repo}/generate`}
              state={{ selectedFiles }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Tests ({selectedFiles.length} files)
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        {currentPath && (
          <button
            onClick={navigateBack}
            className="w-full flex items-center space-x-2 p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors text-white"
          >
            <Folder className="h-5 w-5 text-blue-400" />
            <span>..</span>
          </button>
        )}
        
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors"
          >
            <button
              onClick={() => handleFileSelect(file)}
              className="flex items-center space-x-3 flex-1 text-left"
            >
              {file.type === 'dir' ? (
                <Folder className="h-5 w-5 text-blue-400" />
              ) : (
                <File className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-white">{file.name}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {file.type === 'file' && (
                <input
                  type="checkbox"
                  checked={selectedFiles.some(f => f.path === file.path)}
                  onChange={() => handleFileSelect(file)}
                  className="rounded border-gray-600 text-blue-400 focus:ring-blue-500 bg-gray-700"
                />
              )}
              {file.type === 'dir' && (
                <ChevronRight className="h-4 w-4 text-gray-300" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
