# 🚀 Deployment Guide

## Quick Deploy Options

### 1. **Vercel (Recommended for Full-Stack)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. **Netlify (Frontend + Serverless Functions)**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. **GitHub Pages (Frontend Only)**
```bash
# Deploy to GitHub Pages
npm run deploy
```

### 4. **Railway/Render (Backend + Static Frontend)**
- Connect your GitHub repo
- Set build command: `npm run build`
- Set start command: `npm start`

## Environment Variables Needed

### Frontend (.env)
```
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Backend (.env)
```
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_secret
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend-url.com
PORT=3001
NODE_ENV=production
```

## Pre-deployment Steps

1. **Set up GitHub OAuth App:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL to: `https://your-domain.com/auth/callback`

2. **Get Google Gemini API Key:**
   - Go to Google AI Studio
   - Create API key for Gemini

3. **Update Environment Variables:**
   - Add all required env vars to your deployment platform

4. **Build and Test:**
   ```bash
   npm run build
   npm run preview
   ```

## Deployment Commands

### Build for Production
```bash
# Frontend
npm run build

# Backend
cd backend && npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

## Post-Deployment

1. Update GitHub OAuth callback URL
2. Test all functionality
3. Monitor deployment logs
4. Set up custom domain (optional)

## Troubleshooting

- Ensure all environment variables are set
- Check build logs for errors
- Verify API endpoints are accessible
- Test OAuth flow with production URLs
