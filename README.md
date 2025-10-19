# BabyCollab - Student Collaboration Platform

## Overview

BabyCollab is a comprehensive platform designed for students to find teammates, collaborate on real-world projects, and build a portfolio that gets them hired. The platform provides tools for project management, roadmap tracking, resume building, and social networking.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [How We Built It](#how-we-built-it)
- [Performance Optimizations](#performance-optimizations)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### Dashboard
- Personalized dashboard with real-time statistics
- Quick access to recent projects and roadmaps
- Pending join requests management
- Resume status and AI suggestions
- Social connections management

### Projects
- Create and manage collaborative projects
- Team member recruitment and management
- Real-time chat and file sharing
- Task boards with progress tracking
- Join request system with approval workflow

### Roadmaps
- Career path planning with milestones
- Progress tracking and completion status
- Skill development tracking
- Personalized learning paths

### Resume Builder
- AI-powered resume creation and optimization
- Template selection and customization
- Skill highlighting and achievement showcasing
- Export to PDF functionality

### Social Features
- Profile management with detailed information
- Social connections (LinkedIn, GitHub, Twitter, Portfolio)
- Experience and education tracking
- Skill endorsements from teammates

## Technology Stack

### Frontend
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide React Icons
- Framer Motion for animations

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite Database
- Clerk Authentication

### Authentication
This project uses Clerk for authentication. The following environment variables are required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

These are already configured in the `.env` file.

## How We Built It

### Architecture Overview
BabyCollab follows a modern full-stack architecture with a React-based frontend and a Node.js backend powered by Next.js API routes. The application is structured using the Next.js App Router pattern for optimal performance and maintainability.

### Frontend Development
1. **Component-Based Design**: We built reusable UI components using React and TypeScript for type safety
2. **State Management**: Used React's built-in hooks for state management with additional libraries like Zustand for complex global state
3. **Styling**: Implemented a responsive design system using Tailwind CSS with custom configurations
4. **UI Components**: Leveraged Shadcn UI library for accessible and customizable components
5. **Routing**: Utilized Next.js App Router for client-side navigation and server-side rendering

### Backend Development
1. **API Routes**: Built RESTful API endpoints using Next.js API routes for data fetching and manipulation
2. **Database**: Used Prisma ORM with SQLite for efficient data modeling and querying
3. **Authentication**: Integrated Clerk for secure user authentication and session management
4. **Data Validation**: Implemented Zod for schema validation and type safety

### Performance Considerations
1. **Caching Strategy**: Implemented both server-side and client-side caching to reduce redundant API calls
2. **Database Optimization**: Used Prisma's query optimization features and proper indexing
3. **Code Splitting**: Leveraged Next.js dynamic imports for code splitting and lazy loading
4. **Image Optimization**: Used Next.js Image component for automatic image optimization

### Development Process
1. **Agile Methodology**: Followed iterative development with regular feature releases
2. **Version Control**: Used Git for version control with a branching strategy for feature development
3. **Testing**: Implemented unit tests for critical components and integration tests for API endpoints
4. **Deployment**: Automated deployment using Vercel for continuous integration and delivery

## Performance Optimizations

### Server-Side Optimizations
1. **API Response Caching**: Added HTTP caching headers to API responses:
   - Dashboard stats: 5-minute cache
   - Projects: 5-minute cache for member projects, 10-minute cache for discover projects
   - Roadmaps: 5-minute cache

2. **Database Query Optimization**: 
   - Used `Promise.all()` for parallel database queries to reduce response times
   - Implemented efficient Prisma queries with proper relations

### Client-Side Optimizations
1. **Component Cleanup**: Added cleanup functions to `useEffect` hooks to prevent memory leaks
2. **Data Fetching Utility**: Created a custom caching utility with in-memory cache for client-side data fetching
3. **Loading States**: Implemented skeleton loading states for better perceived performance
4. **Error Handling**: Added robust error handling with fallback to cached data when available

### Code Optimizations
1. **Bundle Size Reduction**: Used dynamic imports for heavy components
2. **Tree Shaking**: Ensured proper tree shaking by using ES modules
3. **Image Optimization**: Leveraged Next.js Image component for automatic optimization

## API Endpoints

### Dashboard APIs
- `GET /api/dashboard/stats` - Fetch dashboard statistics
- `GET /api/dashboard/projects` - Fetch recent projects
- `GET /api/dashboard/roadmaps` - Fetch active roadmaps
- `GET /api/dashboard/resume` - Fetch resume information
- `POST /api/dashboard/resume` - Update resume
- `GET /api/dashboard/connections` - Fetch social connections
- `POST /api/dashboard/connections` - Add/update social connection
- `DELETE /api/dashboard/connections/[id]` - Remove social connection

### Project APIs
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Fetch project details
- `DELETE /api/projects/[id]` - Delete a project
- `POST /api/projects/[id]/join` - Request to join a project
- `GET /api/projects/[id]/join-requests` - Fetch project join requests
- `POST /api/projects/[id]/join-requests/[requestId]` - Accept/reject join request
- `GET /api/projects/[id]/messages` - Fetch project messages
- `POST /api/projects/[id]/messages` - Send a project message
- `POST /api/projects/[id]/files` - Upload a project file

### User APIs
- `GET /api/profile/[id]` - Fetch user profile
- `PUT /api/profile` - Update user profile
- `GET /api/users/[id]` - Fetch user details

### Join Request APIs
- `GET /api/join-requests` - Fetch all join requests for projects where user is admin

## Database Schema

The application uses Prisma ORM with SQLite database. The schema includes:

- Users with profile information, skills, education, and experience
- Projects with team members, join requests, messages, and files
- Roadmaps with milestones and progress tracking
- Resumes with templates and content
- Social connections
- Project join requests with approval workflow

## Deployment

Your project is live at:

**[https://vercel.com/pranavv05s-projects/v0-dashboard-m-o-n-k-y](https://vercel.com/pranavv05s-projects/v0-dashboard-m-o-n-k-y)**

### Deployment Process
1. Code is automatically pushed to this repository from v0.app
2. Vercel monitors the repository for changes
3. On each push to the main branch, Vercel automatically builds and deploys the application
4. Environment variables are configured in the Vercel dashboard

## Development Setup

### Prerequisites
- Node.js (version 18 or higher)
- pnpm package manager
- SQLite (for local development)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd baby_collab
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Available Scripts
- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server
- `pnpm lint` - Runs ESLint for code linting

## Project Structure

```
baby_collab/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── projects/          # Project pages
│   ├── roadmaps/          # Roadmap pages
│   └── ...                # Other pages
├── components/            # Reusable React components
├── lib/                   # Utility functions and libraries
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
└── styles/                # Global styles
```

## Contributing

We welcome contributions to BabyCollab! Here's how you can contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with descriptive commit messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

### Code Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Ensure your code is well-documented
- Add tests for new functionality when applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ By Pranav Vatsa 