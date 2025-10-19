# BabyCollab - Student Collaboration Platform

## Overview

BabyCollab is a comprehensive platform designed for students to find teammates, collaborate on real-world projects, and build a portfolio that gets them hired. The platform provides tools for project management, roadmap tracking, resume building, and social networking.

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

## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables in `.env` file
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `pnpm dev`

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/QCMHxGgAOHI](https://v0.app/chat/projects/QCMHxGgAOHI)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository