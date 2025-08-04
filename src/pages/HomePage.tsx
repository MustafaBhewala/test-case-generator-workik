import { Link } from 'react-router-dom';
import { Github, Zap, Code, GitPullRequest } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user, login } = useAuth();

  const features = [
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Connect to your GitHub repositories and browse code files with ease.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Generate intelligent test cases using advanced AI technology.',
    },
    {
      icon: Code,
      title: 'Multiple Frameworks',
      description: 'Support for Jest, JUnit, pytest, and other popular testing frameworks.',
    },
    {
      icon: GitPullRequest,
      title: 'PR Creation',
      description: 'Automatically create pull requests with your generated test cases.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Generate Test Cases with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect your GitHub repositories and let AI generate comprehensive test cases
          for your code. Save time and improve code quality with intelligent test generation.
        </p>
        
        {user ? (
          <Link
            to="/repositories"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Browse Repositories</span>
          </Link>
        ) : (
          <button
            onClick={login}
            className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Get Started with GitHub</span>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 py-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="font-semibold mb-2">Connect Repository</h3>
            <p className="text-gray-600 text-sm">
              Browse and select files from your GitHub repositories
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="font-semibold mb-2">Generate Tests</h3>
            <p className="text-gray-600 text-sm">
              AI analyzes your code and suggests comprehensive test cases
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h3 className="font-semibold mb-2">Create PR</h3>
            <p className="text-gray-600 text-sm">
              Automatically create a pull request with generated test files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
