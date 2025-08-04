import { Link } from 'react-router-dom';
import { Github, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Github className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Test Case Generator
            </h1>
          </Link>

          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/repositories"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  My Repositories
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700">{user.name || user.login}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>Login with GitHub</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
