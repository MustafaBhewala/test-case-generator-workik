import { Link } from 'react-router-dom';
import { Github, Zap, Code, GitPullRequest, Sparkles, Rocket, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user, login } = useAuth();

  const features = [
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Seamlessly connect to your GitHub repositories and browse code files with intelligent file detection.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Generate intelligent test cases using Google Gemini AI with context-aware analysis.',
    },
    {
      icon: Code,
      title: 'Multiple Frameworks',
      description: 'Support for Jest, JUnit, pytest, Mocha, and other popular testing frameworks.',
    },
    {
      icon: GitPullRequest,
      title: 'PR Creation',
      description: 'Automatically create pull requests with your generated test cases and detailed documentation.',
    },
  ];

  const stats = [
    { icon: Clock, value: '80%', label: 'Time Saved' },
    { icon: Shield, value: '95%', label: 'Code Coverage' },
    { icon: Rocket, value: '50+', label: 'Frameworks' },
    { icon: Sparkles, value: '10k+', label: 'Tests Generated' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Demo Notice Banner */}
      <div className="mx-4 mt-6 mb-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-200 text-sm">
            <strong>Demo Mode:</strong> This is a frontend-only demo. GitHub OAuth and AI features will show mock data.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="bg-gray-800 rounded-3xl p-16 mb-12 border border-gray-700">
          <div className="inline-flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full border border-gray-600 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Powered by Google Gemini AI</span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Generate Test Cases
            <br />
            <span className="text-5xl text-blue-400">with AI Magic ✨</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Transform your development workflow with intelligent test generation. Connect your GitHub repositories 
            and let our AI create comprehensive, framework-specific test cases that actually make sense.
          </p>
          
          {user ? (
            <Link
              to="/repositories"
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Github className="h-6 w-6" />
              <span>Browse Your Repositories</span>
            </Link>
          ) : (
            <button
              onClick={login}
              className="inline-flex items-center space-x-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Github className="h-6 w-6" />
              <span>Get Started with GitHub</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 px-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
            <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-20 px-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="inline-flex p-4 rounded-2xl bg-blue-900 mb-6">
              <feature.icon className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-800 rounded-3xl p-12 mx-4 mb-12 border border-gray-700">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-300">Three simple steps to better testing</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Connect Repository</h3>
            <p className="text-gray-300 leading-relaxed">
              Authenticate with GitHub and browse your repositories. Our AI will intelligently detect testable code files.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Generate Tests</h3>
            <p className="text-gray-300 leading-relaxed">
              Select your files and let Google Gemini AI analyze your code to generate comprehensive, meaningful test cases.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Deploy & Iterate</h3>
            <p className="text-gray-300 leading-relaxed">
              Review generated tests, create pull requests automatically, and continuously improve your code quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
