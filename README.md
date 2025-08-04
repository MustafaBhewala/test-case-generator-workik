# 🧪 AI Test Case Generator

> **Intelligent test case generation powered by AI and seamlessly integrated with GitHub**

A modern full-stack application that automatically generates comprehensive test cases for your codebase using Google Gemini AI, with complete GitHub integration for repository management and pull request automation.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Key Features

### 🔗 **GitHub Integration**
- OAuth authentication with GitHub
- Repository browsing and file navigation
- Automatic pull request creation with generated tests

### 🤖 **AI-Powered Generation**
- Google Gemini AI for intelligent test case creation
- Support for multiple testing frameworks (Jest, JUnit, pytest, NUnit, etc.)
- Context-aware test generation based on code analysis

### 📁 **Multi-File Processing**
- Select and process multiple files simultaneously
- Batch test case generation
- Framework auto-detection based on file types

### 🎨 **Modern UI/UX**
- Clean, dark-themed interface
- Responsive design for all devices
- Interactive file browser with search functionality
- Real-time loading states and error handling

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express, TypeScript |
| **AI Integration** | Google Gemini API |
| **Authentication** | GitHub OAuth |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **HTTP Client** | Axios |

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- GitHub OAuth App credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MustafaBhewala/test-case-generator-workik.git
   cd test-case-generator-workik
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Edit `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # GitHub OAuth (get from https://github.com/settings/developers)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Google Gemini AI (get from https://aistudio.google.com/)
   GEMINI_API_KEY=your_gemini_api_key
   
   # JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   JWT_SECRET=your_jwt_secret_here
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   ```

5. **Start the development servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to `http://localhost:5173` in your browser

## 📖 Usage Guide

### 1. **Authentication**
- Click "Login with GitHub" to authenticate
- Grant necessary permissions for repository access

### 2. **Repository Selection**
- Browse your GitHub repositories
- Use the search function to find specific repositories
- Click on a repository to explore its files

### 3. **File Selection**
- Navigate through the repository file structure
- Select multiple code files (supports .js, .ts, .py, .java, .cs, .go)
- Click "Generate Tests" to proceed

### 4. **Test Generation**
- Review AI-generated test case summaries
- Each summary shows framework, complexity, and estimated lines
- Click "Generate Code" on any summary to create the full test

### 5. **Code Review & Download**
- Preview the generated test code with syntax highlighting
- Download individual test files
- Optionally create a pull request with all generated tests

## 🧪 Supported Testing Frameworks

| Language | Framework | File Extensions |
|----------|-----------|----------------|
| JavaScript/TypeScript | Jest, Mocha | `.js`, `.ts`, `.jsx`, `.tsx` |
| Python | pytest, unittest | `.py` |
| Java | JUnit | `.java` |
| C# | NUnit | `.cs` |
| Go | testing | `.go` |

## 📁 Project Structure

Edit `backend/.env` with your credentials:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_here
```

### 3. Frontend Setup
```bash
# From root directory
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```

2. **Start the frontend (in a new terminal):**
```bash
npm run dev
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔧 Setup GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Test Case Generator
   - **Homepage URL**: http://localhost:5173
   - **Authorization callback URL**: http://localhost:5173/auth/callback
3. Copy the Client ID and Client Secret to your environment files

## 🤖 Setup Google Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the API key to your backend `.env` file

## 📱 Usage

1. **Login**: Click "Login with GitHub" to authenticate
2. **Browse Repositories**: View your GitHub repositories
3. **Select Files**: Navigate through repository files and select code files
4. **Generate Test Summaries**: AI analyzes your code and suggests test cases
5. **Generate Test Code**: Select summaries to generate full test implementations
6. **Create Pull Request**: Automatically create a PR with generated test files

## 🧪 Supported Test Frameworks

- **JavaScript/TypeScript**: Jest
- **Python**: pytest
- **Java**: JUnit
- **C#**: NUnit
- **Go**: testing package

## 🏗️ Project Structure

```
WorkikTask/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── backend/               # Backend source
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── package.json
├── public/                # Static assets
└── package.json          # Frontend dependencies
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with npm start
```

## 📋 Assignment Checklist

- ✅ GitHub integration with OAuth
- ✅ Repository and file browsing UI
- ✅ AI-powered test case generation
- ✅ Multiple file selection support
- ✅ Test case summaries display
- ✅ Full test code generation
- ✅ Pull request creation (optional)
- ✅ Clean, responsive UI/UX
- ✅ TypeScript throughout
- ✅ Error handling and loading states

## 🎥 Demo

The application demonstrates:
1. Seamless GitHub integration
2. Intuitive file browsing and selection
3. AI-generated test case summaries
4. Real-time test code generation
5. One-click PR creation

## 🤝 Contributing

This project was created as part of the Workik AI internship assignment. For questions or improvements, please reach out to the development team.

## 📄 License

MIT License - see LICENSE file for details.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
