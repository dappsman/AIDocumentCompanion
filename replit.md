# Prompt Roast - AI Response Comparison Platform

## Overview

Prompt Roast is a full-stack JavaScript web application that compares AI responses from multiple providers (GPT, Claude, Gemini) to creative prompts. The platform features a sarcastic, dark-themed UI with fire gradient styling and affiliate marketing integration. Built with modern web technologies for optimal performance and user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with Vite for development
- **Styling**: Tailwind CSS with custom dark theme and fire gradient styling
- **Component Structure**: Shadcn/UI components with custom modifications
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **API Layer**: Express.js REST API with TypeScript
- **AI Integration**: Placeholder structure for OpenAI GPT, Anthropic Claude, Google Gemini
- **Response Processing**: Server-side API calls to AI providers (placeholders implemented)
- **Storage**: In-memory storage with extensible interface

### Data Storage
- **Current**: In-memory storage (MemStorage class)
- **Schema**: Zod schemas for type safety and validation
- **Models**: Prompts and AI responses with rating system

## Key Components

### Core Components
1. **Home.tsx**: Main landing page with prompt selection and creation interface
2. **PromptDetail.tsx**: Individual prompt page with AI response comparison
3. **UI Components**: Shadcn/UI components (Button, Card, Input, Textarea, Toast)
4. **Theme Provider**: Dark theme management with local storage persistence
5. **Storage System**: In-memory storage with extensible interface

### Implemented Features
- Prompt creation and management
- AI response placeholder generation
- Rating system for AI responses
- Responsive design with fire gradient styling
- Affiliate link integration
- SEO optimization with meta tags

## Data Flow

1. **Prompt Selection**: User selects or inputs a creative prompt
2. **AI API Calls**: Server-side requests to multiple AI providers
3. **Response Aggregation**: Collect and format responses from all providers
4. **Display**: Present responses in comparative grid layout
5. **Affiliate Tracking**: Track clicks on affiliate links

## External Dependencies

### AI Providers
- **OpenAI API**: For GPT responses
- **Anthropic Claude API**: For Claude responses  
- **Google Gemini API**: For Gemini responses

### Frontend Dependencies
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **React**: UI library

### Recommended Additions
- **Drizzle ORM**: For database operations
- **Database**: PostgreSQL or similar for storing prompts and responses
- **API Rate Limiting**: To manage AI provider API costs
- **Analytics**: For affiliate link tracking

## Deployment Strategy

- **Platform**: Replit Deployments (Autoscale) with Express.js serving static files
- **Build Process**: Client builds to `client/dist`, server serves static files
- **Environment Variables**: Required for AI API keys and database connections
- **Port Configuration**: Single application serves on port 80 (deployment standard)
- **Health Check**: `/health` endpoint for deployment monitoring

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Status

### Current State
- ✅ Full-stack architecture implemented
- ✅ Frontend React application with Vite
- ✅ Backend Express API with TypeScript
- ✅ In-memory storage system
- ✅ Dark theme with fire gradient styling
- ✅ Responsive design for all devices
- ✅ SEO optimization with meta tags
- ✅ Placeholder AI integration structure

### Running Instructions
- **Development**: `node start.js` (runs backend on port 3000, frontend on port 5173)
- **Production**: `tsx server/index.ts` (single server on port 80 serving API + static files)
- **Build**: `cd client && npm run build` (builds frontend to client/dist)
- **API Endpoints**: Available at `/api/prompts`, `/api/responses`, etc.
- **Health Check**: `/health` endpoint for deployment monitoring

### Next Steps for Production
1. Integrate real AI APIs (OpenAI, Anthropic, Google)
2. Add database persistence (PostgreSQL recommended)
3. Implement user authentication
4. Add analytics tracking
5. Deploy to production environment

## Changelog

- July 08, 2025: Deployment Configuration Fixed
  - ✅ Applied deployment fixes for Replit Autoscale compatibility
  - ✅ Single server deployment on port 80 (tsx server/index.ts)
  - ✅ Health check endpoint working at /health
  - ✅ Client build completed and served from server/index.ts
  - ✅ Removed multiple port configuration for single application server
  - ✅ Fixed TypeScript build errors in toast components and queryClient
  - ✅ Production scripts ready: deploy.js, start-production.js, build.js
- July 08, 2025: Deployment Configuration
  - Fixed Express version compatibility (downgraded to 4.18.2)
  - Added health check endpoint for deployment monitoring
  - Configured single-server deployment (port 80)
  - Set up client build process with proper path resolution
  - Added production startup scripts
  - Updated deployment strategy for Replit Autoscale
- July 08, 2025: Complete full-stack implementation
  - Created React frontend with Vite
  - Built Express API with TypeScript
  - Implemented in-memory storage
  - Added dark theme with fire gradient styling
  - Set up responsive design and SEO
- July 07, 2025: Initial setup