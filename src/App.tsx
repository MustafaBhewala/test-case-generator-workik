import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { FileBrowserPage } from './pages/FileBrowserPage';
import { TestGeneratorPage } from './pages/TestGeneratorPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router basename="/test-case-generator-workik">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/repositories" element={<RepositoriesPage />} />
              <Route path="/repository/:owner/:repo" element={<FileBrowserPage />} />
              <Route path="/repository/:owner/:repo/generate" element={<TestGeneratorPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
