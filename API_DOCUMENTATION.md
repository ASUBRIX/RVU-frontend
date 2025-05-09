# Learning Application API Documentation

## Overview
This document provides comprehensive documentation for the Learning Application's API endpoints and routes. The application is built using React with Vite and integrates with Firebase for backend services.

## Tech Stack
- Frontend: React 18.2.0
- Routing: React Router DOM 6.26.0
- State Management: React Hook Form 7.52.1
- UI Components: React Bootstrap 2.10.7
- Backend/Database for Mobile: Firebase 11.4.0
- SQL Database: PostgreSQL
- HTTP Client: Axios 1.7.3

## Authentication Routes

### Sign In
- **Path**: `/auth/sign-in`
- **Method**: POST
- **Description**: Authenticates a user and creates a session
- **Required Fields**:
  - mobile
  - otp

### Sign Up
- **Path**: `/auth/sign-up`
- **Method**: POST
- **Description**: Creates a new user account
- **Required Fields**:
  - email
  - mobile
  - password
  - name

### Forgot Password
- **Path**: `/auth/forgot-password`
- **Method**: POST
- **Description**: Initiates password reset process
- **Required Fields**:
  - email
  - mobile
  - otp

## Main Application Routes
  

### Admin Routes
- `/admin/settings` - Admin settings management
- `/admin/reports` - View course and user reports
  - Course reports
  - Popular courses
  - Summary statistics

### Instructor Routes
- `/instructor/create-course` - Course creation interface
- `/instructor/course-added` - Course confirmation page
- Features:
  - Add lectures
  - Add topics
  - Add questions
  - Course banner management

### Student Routes
- `/academy/home` - Student dashboard
- Features:
  - Enrolled courses
  - Course catalog
  - Popular courses
  - Upcoming events

### Academy Routes
- **Path**: `/academy/home`
- **Method**: GET
- **Description**: Fetches main dashboard data for the academy home page
- **Response**: Combined data for dashboard including featured courses, notices, and user-specific data

### Course Routes
- **Path**: `/courses/enrolled`
- **Method**: GET
- **Description**: Retrieves list of courses enrolled by the current user with progress
- **Required**: Authentication token
- **Response**: Array of enrolled courses with:
  - id
  - title
  - image
  - progress
  - instructor
  - duration
  - rating
  - enrolled count
  - lastAccessed

- **Path**: `/courses/popular`
- **Method**: GET
- **Description**: Retrieves list of most popular courses by category
- **Query Parameters**:
  - category (optional): Filter by course category
- **Response**: Array of courses with:
  - title
  - image
  - description
  - pricing plans
  - rating
  - instructor

- **Path**: `/courses/featured`
- **Method**: GET
- **Description**: Retrieves list of featured courses
- **Response**: Array of featured courses with full course details

- **Path**: `/courses/offers`
- **Method**: GET
- **Description**: Retrieves current course offers and discounts
- **Response**: Array of courses with:
  - title
  - original price
  - discounted price
  - offer expiry
  - course details

### Content Routes
- **Path**: `/hero-banners`
- **Method**: GET
- **Description**: Retrieves hero slider banners
- **Response**: Array of banner images and content

- **Path**: `/notices/latest`
- **Method**: GET
- **Description**: Retrieves current notices and announcements
- **Response**: Array of notices with:
  - id
  - text
  - date
  - tag
  - priority

- **Path**: `/testimonials`
- **Method**: GET
- **Description**: Retrieves user testimonials
- **Response**: Array of testimonials with:
  - user details
  - course
  - rating
  - review text
  - date

- **Path**: `/about`
- **Method**: GET
- **Description**: Retrieves academy about information
- **Response**: About page content with:
  - description
  - statistics
  - features
  - achievements

- **Path**: `/events/upcoming`
- **Method**: GET
- **Description**: Retrieves list of upcoming events
- **Response**: Array of events with dates and details

## Data Models

### User
- id: string
- email: string
- name: string
- role: ['admin' | 'instructor' | 'student']
- createdAt: timestamp

### Course
- id: string
- title: string
- description: string
- instructor: reference
- topics: array
- lectures: array
- createdAt: timestamp
- updatedAt: timestamp

### Lecture
- id: string
- title: string
- content: string
- courseId: reference
- order: number

## Security
- Firebase Authentication for user management
- Role-based access control
- Secure routes protection
- API request validation

## Error Handling
The application uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
API requests are subject to Firebase's standard rate limiting policies.

## Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Additional Resources
- Firebase Console for backend management
- React Bootstrap documentation for UI components
- React Router documentation for routing
