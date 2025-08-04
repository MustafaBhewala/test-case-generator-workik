# Test Case Generator - Workik AI Assignment

A full-stack application that integrates with GitHub and uses AI to generate intelligent test cases for your code.

## 🚀 Features

- **GitHub Integration**: OAuth authentication and repository browsing
- **AI-Powered Test Generation**: Uses Google Gemini AI to generate comprehensive test cases
- **Multi-Framework Support**: Jest, JUnit, pytest, NUnit, and more
- **Interactive File Browser**: Select multiple files for batch test generation
- **Test Case Summaries**: Preview test cases before generating full code
- **Pull Request Creation**: Automatically create PRs with generated test files
- **Clean UI/UX**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for routing
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express and TypeScript
- **Google Gemini AI** for test case generation
- **GitHub API** integration
- **CORS** enabled for frontend communication

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- GitHub OAuth App (for authentication)
- Google Gemini API key

### 1. Clone and Setup
```bash
git clone <repository-url>
cd WorkikTask
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

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
