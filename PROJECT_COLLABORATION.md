# Project Collaboration Features

This document explains how the project collaboration features work in the application.

## Overview

The project collaboration system allows users to:
1. Create projects
2. Discover projects created by others
3. Request to join projects
4. Manage project members
5. Collaborate on project tasks

## Key Components

### 1. Project Creation
- Users can create projects through the "New Project" button
- Projects are created with a title, description, required skills, team size, and due date
- The creator automatically becomes the project owner and a member

### 2. Discover Projects
- The "Discover Projects" tab shows projects that:
  - The current user is NOT a member of
  - Are marked as "recruiting" (isRecruiting = true)
  - Have not been completed (status != 'completed')
- Projects are sorted by creation date (newest first)
- Users can filter projects by:
  - Search terms (title, description, skills)
  - Required skills
  - Project status
  - Team size
  - Open positions only

### 3. Join Request System
- Users can request to join projects through the "Request to Join" button
- The system checks if the user:
  - Is already a member of the project
  - Has already submitted a pending request
  - Has already been accepted to the project
- Join requests are stored in the database with a "pending" status
- Project admins can accept or reject join requests

### 4. Project Management
- Project owners can manage members and tasks
- Members can view project details and contribute
- Tasks can be assigned and tracked through the task board

## API Endpoints

### Projects API
- `GET /api/projects?type=member` - Get projects where user is a member
- `GET /api/projects?type=discover` - Get projects available for discovery
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get details for a specific project
- `PUT /api/projects/[id]` - Update a project (admin only)
- `DELETE /api/projects/[id]` - Delete a project (admin only)

### Join Requests API
- `POST /api/projects/[id]/join` - Submit a join request
- `GET /api/projects/[id]/join-requests` - Get join requests for a project (admin only)
- `PUT /api/projects/[id]/join-requests/[requestId]` - Accept/reject a join request (admin only)

## Database Schema

### Project Model
- `id` - Unique identifier
- `creatorId` - ID of the user who created the project
- `title` - Project title
- `description` - Short description
- `fullDescription` - Detailed description
- `status` - Current status (planning, active, completed, etc.)
- `difficultyLevel` - Project difficulty
- `maxTeamSize` - Maximum team size
- `currentTeamSize` - Current team size
- `isRecruiting` - Whether the project is accepting new members
- `createdAt` - Creation timestamp
- `dueDate` - Project deadline

### ProjectMember Model
- `projectId` - ID of the project
- `userId` - ID of the member
- `role` - Member role (Owner, Member, etc.)
- `joinedAt` - When the user joined

### ProjectJoinRequest Model
- `projectId` - ID of the project
- `userId` - ID of the requesting user
- `message` - Optional message from the user
- `status` - Request status (pending, accepted, rejected)
- `createdAt` - Request timestamp

## Troubleshooting

### Common Issues

1. **Projects not appearing in Discover Projects**
   - Check that `isRecruiting` is set to `true`
   - Verify the project status is not "completed"
   - Ensure the current user is not already a member

2. **Join requests failing**
   - Verify the user is logged in
   - Check if the user is already a member
   - Ensure the project exists and is recruiting

3. **Projects not appearing in My Projects**
   - Verify the user is actually a member of the project
   - Check the projectMember relationship in the database

### Testing

Use the provided test scripts to verify functionality:
- `test-discover-projects.js` - Test the discover projects functionality
- `check-projects-db.js` - Check the database directly
- `test-project-collaboration.js` - Test the complete workflow

## Future Improvements

1. Add real-time notifications for join requests
2. Implement project invitations (admins can invite users)
3. Add project categories and tags for better discovery
4. Implement a project rating/review system
5. Add project analytics and progress tracking