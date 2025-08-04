import { Link } from 'react-router-dom';
import { Github, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
              <Github className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Test Case Generator
              </h1>
              <p className="text-xs text-gray-300">AI-Powered Testing</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/repositories"
                  className="text-gray-300 hover:text-blue-400 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-700"
                >
                  My Repositories
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-700 rounded-full px-4 py-2 border border-gray-600">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-blue-400"
                    />
                    <span className="text-white font-medium">{user.name || user.login}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">Login with GitHub</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
