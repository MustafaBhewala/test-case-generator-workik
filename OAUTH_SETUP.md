# GitHub OAuth Setup Instructions

## Create GitHub OAuth App

1. **Go to GitHub Developer Settings:**
   - Visit: https://github.com/settings/developers
   - Click "OAuth Apps" → "New OAuth App"

2. **OAuth App Configuration:**
   ```
   Application name: Test Case Generator - Workik AI
   Homepage URL: http://localhost:5173
   Application description: AI-powered test case generator with GitHub integration
   Authorization callback URL: http://localhost:5173/auth/callback
   ```

3. **After creating the app:**
   - Copy the `Client ID`
   - Generate and copy the `Client Secret`

## Update Environment Files

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret for session management
JWT_SECRET=your_jwt_secret_here_generate_random_string
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
```

## Get Google Gemini API Key

1. **Go to Google AI Studio:**
   - Visit: https://aistudio.google.com/
   - Click "Get API Key"
   - Create a new API key
   - Copy the API key

## Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Test the Setup

After setting up all environment variables:

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Visit: http://localhost:5173
4. Click "Login with GitHub" to test OAuth flow
