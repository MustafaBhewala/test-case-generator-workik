<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Test Case Generator Project Instructions

This is a full-stack application that integrates with GitHub and uses AI to generate test cases.

## Project Structure
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript

## Key Features
1. GitHub OAuth integration for repository access
2. File browser UI for selecting code files
3. AI-powered test case generation using Google Gemini
4. Test case summary display and selection
5. Generated test code display
6. Optional GitHub PR creation with test cases

## Tech Stack Guidelines
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Use Lucide React for icons
- Use Axios for HTTP requests
- Use React Router for navigation
- Follow REST API patterns for backend
- Use proper error handling and loading states
- Implement responsive design principles

## AI Integration
- Use Google Gemini API for test case generation
- Support multiple test frameworks (Jest for React, JUnit for Java, pytest for Python, etc.)
- Generate meaningful test case summaries before full code generation
- Support batch processing of multiple files

## Security
- Implement proper environment variable handling
- Use secure GitHub OAuth flow
- Validate all inputs
- Implement proper CORS settings
