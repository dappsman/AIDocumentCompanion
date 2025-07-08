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

- **Platform**: Suitable for Vercel, Netlify, or similar Next.js-friendly platforms
- **Environment Variables**: Required for AI API keys and database connections
- **Static Generation**: Consider ISR (Incremental Static Regeneration) for popular prompts
- **CDN**: Leverage Next.js built-in optimizations for static assets

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
- **Server**: `cd server && tsx index.ts` (runs on port 3000)
- **Frontend**: `cd client && vite --host 0.0.0.0 --port 5173` (runs on port 5173)
- **API Endpoints**: Available at `/api/prompts`, `/api/responses`, etc.

### Next Steps for Production
1. Integrate real AI APIs (OpenAI, Anthropic, Google)
2. Add database persistence (PostgreSQL recommended)
3. Implement user authentication
4. Add analytics tracking
5. Deploy to production environment

## Changelog

- July 08, 2025: Complete full-stack implementation
  - Created React frontend with Vite
  - Built Express API with TypeScript
  - Implemented in-memory storage
  - Added dark theme with fire gradient styling
  - Set up responsive design and SEO
- July 07, 2025: Initial setup